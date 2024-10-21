const axios = require("axios");
const { serializeError } = require("serialize-error");
const moment = require("moment");
const {
    saveUpgradeUse,
    fetchUpgradeUsed,
    upsertUpgradeLock,
    findStorePartnerId,
    isReservationInProgress,
    expireUpgrade,
} = require("../queries/upgrade.query");
const { PremiumItemsENUM } = require("../../src/lib/enum/store");
const logger = require("../../src/lib/logger");

const { PremiumItemsParamENUM } = require("../../src/lib/enum/store");
const db = require("../services/db/definitions/db.init");
const { getStoreItemsOwnedByUser, updateUserUpgradeAmount } = require("../queries/storeUser.query");
const { UPGRADE_ERRORS } = require("../enum/UpgradeErrors");
const { getOfferWithLimits } = require("../queries/offers.query");
const { bookAllocationGuaranteed } = require("../queries/invest.query");
const { getUserAllocationMax, roundAmount } = require("../../src/lib/investment");
const { authTokenName } = require("../../src/lib/authHelpers");
const { BookingErrorsENUM } = require("../../src/lib/enum/invest");
const { createHash } = require("./helpers");

async function useGuaranteed(offerId, user, transaction) {
    const { userId, partnerId, tenantId } = user;

    const userAppliedUpgrades = await fetchUpgradeUsed(userId, offerId, tenantId, transaction);
    const upgradeGuaranteed = userAppliedUpgrades?.find((el) => el.id === PremiumItemsENUM.Guaranteed)?.amount;
    const upgradeIncreased = userAppliedUpgrades?.find((el) => el.id === PremiumItemsENUM.Increased)?.amount;

    if (upgradeGuaranteed) {
        return {
            ok: false,
            state: 1,
        };
    }

    const offer = await getOfferWithLimits(offerId);
    const offerLimit =
        offer.offerLimits.find((el) => el.partnerId === tenantId) ||
        offer.offerLimits.find((el) => el.partnerId === partnerId && !el.isTenantExclusive);

    const { allocationUser_max } = getUserAllocationMax(user, { ...offer, ...offerLimit }, upgradeIncreased);

    const maxAllocation = roundAmount(allocationUser_max);
    const amount = maxAllocation < PremiumItemsParamENUM.Guaranteed ? maxAllocation : PremiumItemsParamENUM.Guaranteed;
    const increaseGuaranteedReservations = await bookAllocationGuaranteed(
        offerId,
        amount,
        offer.offerLimit.alloTotal,
        transaction,
    );

    if (!increaseGuaranteedReservations.ok) {
        return {
            ok: false,
            state: 2,
        };
    }

    return {
        ok: true,
        data: amount,
    };
}

async function useUpgrade(user, req) {
    let offerId, storeId, transaction;

    try {
        offerId = Number(req.params.id);
        storeId = Number(req.params.upgrade);

        const { userId, tenantId } = user;

        transaction = await db.transaction();

        //check if user has upgrades
        const isUserOwnsUpgrade = await getStoreItemsOwnedByUser(userId, tenantId, storeId, transaction);
        if (!isUserOwnsUpgrade.ok || !(isUserOwnsUpgrade?.data?.amount > 0)) {
            await transaction.rollback();
            return {
                ok: false,
                error: "No upgrade owned",
            };
        }

        let allocation;
        //check if user used Guaranteed (limit - only one)
        if (storeId === PremiumItemsENUM.Guaranteed) {
            const saveStatus_upgrade = await useGuaranteed(offerId, user, transaction);
            if (!saveStatus_upgrade.ok) {
                logger.warn("ERROR :: [useUpgrade] - guaranteed couldnt apply", {
                    saveStatus_upgrade,
                    isUserOwnsUpgrade,
                    user,
                    prams: req.params,
                });
                await transaction.rollback();
                return {
                    ok: false,
                    error:
                        saveStatus_upgrade.state === 1
                            ? UPGRADE_ERRORS.NotEnoughAllocation
                            : UPGRADE_ERRORS.GuaranteedUsed,
                };
            }
            allocation = saveStatus_upgrade.data;
        }

        //save used upgrade
        const save = await saveUpgradeUse(
            userId,
            isUserOwnsUpgrade.data.storePartnerId,
            offerId,
            1,
            allocation,
            transaction,
        );
        if (!save.ok) {
            logger.warn("ERROR :: [useUpgrade] - couldnt save use of upgrade", {
                save,
                user,
                offerId,
                storeId,
            });
            await transaction.rollback();
            return {
                ok: false,
                error: UPGRADE_ERRORS.ErrorSavingUse,
            };
        }

        const deduct = await updateUserUpgradeAmount(userId, isUserOwnsUpgrade.data.storePartnerId, -1, transaction);
        if (!deduct.ok) {
            await transaction.rollback();
            return {
                ok: false,
                error: UPGRADE_ERRORS.NotEnoughAllocation,
            };
        }

        await transaction.commit();
        return {
            ok: true,
        };
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        logger.error("ERROR :: [useUpgrade]", {
            error: serializeError(error),
            offerId,
            user,
            params: req.params,
        });
        return {
            ok: false,
            error: UPGRADE_ERRORS.Unexpected,
        };
    }
}

const validateParams = (req) => {
    const { body, user } = req;
    const { chainId, amount, storeId } = body;
    const { userId, tenantId, accountId } = user;

    if (!storeId || !userId || !accountId || !chainId || !amount || !tenantId) {
        return { ok: false, error: "Missing required parameters" };
    }

    return { ok: true, data: { tenantId, userId, accountId, chainId, amount, storeId } };
};

async function obtainSignature(hash, amount, expires, chainId, partnerId, storeId, token) {
    console.log("Buy upgrade obtrainSignature", {
        hash,
        amount,
        expires,
        chainId,
        partnerId,
        storeId,
    });

    const signature = await axios.post(
        `${process.env.AUTHER}/store/sign`,
        {
            hash,
            amount,
            expires,
            blockchainId: chainId,
            partnerId,
            storeId,
            token,
        },
        {
            headers: {
                "content-type": "application/json",
            },
        },
    );
    if (!signature?.data?.ok) {
        return {
            ok: false,
            code: BookingErrorsENUM.BAD_SIGNATURE,
        };
    }

    return {
        ok: true,
        data: signature.data.data,
    };
}

async function reserveUpgrade(req) {
    let transaction;

    try {
        transaction = await db.transaction();
        const token = req.cookies[authTokenName];

        const queryParams = validateParams(req);
        if (!queryParams.ok) return queryParams;

        const { userId, tenantId, chainId, amount, storeId } = queryParams.data;

        const storePartnerId = await findStorePartnerId(storeId, tenantId);
        // const reservationInProgress = await isReservationInProgress(userId, storePartnerId);
        // if (reservationInProgress) {
        //     throw new Error("Reservation is already in progress for this user and store");
        // }

        const now = moment.utc().unix();
        const expires = now + 10 * 60;
        const hash = createHash(`${userId}` + `${now}`);

        const reservation = await upsertUpgradeLock(userId, storePartnerId, chainId, hash, expires, transaction);

        if (!reservation.ok) {
            return reservation;
        }

        const signature = await obtainSignature(hash, amount, expires, chainId, tenantId, storeId, token);

        if (!signature.ok) {
            await expireUpgrade(userId, hash);
            return signature;
        }

        await transaction.commit();

        return {
            ok: true,
            hash: reservation.data.hash,
            expires: reservation.data.expireDate,
            signature: signature.data,
            tenantId,
            storePartnerId,
            storeId,
        };
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        logger.error(`ERROR :: [reserveUpgrade]`, {
            reqQuery: req.query,
            error: serializeError(error),
        });
        return { ok: false, error: error.message };
    }
}

module.exports = { useUpgrade, reserveUpgrade };
