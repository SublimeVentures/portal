const axios = require("axios");
const moment = require("moment");
const { serializeError } = require("serialize-error");
const {
    pickMysteryBox,
    assignMysteryBox,
    processMBAllocation,
    processMBUpgrade,
    upsertMysteryBoxLock,
    findStorePartnerId,
    isReservationInProgress,
    expireMysteryBox,
} = require("../queries/mysterybox.query");
const db = require("../services/db/definitions/db.init");
const { MYSTERYBOX_CLAIM_ERRORS, PremiumItemsENUM, MYSTERY_TYPES } = require("../../src/lib/enum/store");
const { getStoreItemsOwnedByUser, updateUserUpgradeAmount } = require("../queries/storeUser.query");
const logger = require("../../src/lib/logger");
const { UPGRADE_ERRORS } = require("../enum/UpgradeErrors");
const { BookingErrorsENUM } = require("../../src/lib/enum/invest");
const { authTokenName } = require("../../src/lib/authHelpers");
const { createHash } = require("./helpers");

async function processMysteryBox(userId, claim, transaction) {
    switch (claim.type) {
        case MYSTERY_TYPES.Allocation: {
            return await processMBAllocation(transaction, claim, userId);
        }
        case MYSTERY_TYPES.Upgrade: {
            return await processMBUpgrade(transaction, claim, userId);
        }
        case MYSTERY_TYPES.Discount: {
            return { ok: true };
        }
        case MYSTERY_TYPES.NFT: {
            return { ok: true };
        }
    }
}

async function claim(user) {
    const { userId, tenantId } = user;

    let transaction;
    try {
        transaction = await db.transaction();

        const isUserOwnMB = await getStoreItemsOwnedByUser(userId, tenantId, PremiumItemsENUM.MysteryBox, transaction);
        if (!isUserOwnMB.ok || !(isUserOwnMB?.data?.amount > 0)) {
            await transaction.rollback();
            return {
                ok: false,
                error: MYSTERYBOX_CLAIM_ERRORS.UserNoBoxes,
            };
        }

        const selectedMysteryBox = await pickMysteryBox(tenantId, transaction);

        if (!selectedMysteryBox.ok) {
            await transaction.rollback();
            return {
                ok: false,
                error: MYSTERYBOX_CLAIM_ERRORS.NotEnoughBoxes,
            };
        }

        const assign = await assignMysteryBox(userId, selectedMysteryBox.data.id, transaction);
        if (!assign.ok) {
            await transaction.rollback();
            return {
                ok: false,
                error: MYSTERYBOX_CLAIM_ERRORS.AssignBox,
            };
        }

        const deduct = await updateUserUpgradeAmount(userId, isUserOwnMB.data.storePartnerId, -1, transaction);

        if (!deduct.ok) {
            await transaction.rollback();
            return {
                ok: false,
                error: UPGRADE_ERRORS.Deduction,
            };
        }

        const final = await processMysteryBox(userId, selectedMysteryBox.data, transaction);
        if (!final.ok) {
            await transaction.rollback();
            return { ok: false, error: final.error };
        }

        await transaction.commit();

        return {
            ok: true,
            type: selectedMysteryBox.data.type,
            name: selectedMysteryBox.data.name,
            item: selectedMysteryBox.data.item,
            relatedInvestment: selectedMysteryBox.data.offerId,
            discount: selectedMysteryBox.data.discount,
            code: selectedMysteryBox.data.code,
        };
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        logger.error("ERROR :: [claimMysterybox]", {
            error: serializeError(error),
            user,
        });
        return {
            ok: false,
            error: MYSTERYBOX_CLAIM_ERRORS.Unexpected,
        };
    }
}

const validateParams = (req) => {
    const { body, user } = req;
    const { chainId, amount } = body;
    const { userId, tenantId, accountId, partnerId } = user;

    if (!tenantId || !userId || !accountId || !partnerId || !chainId || !amount) {
        return { ok: false, error: "Missing required parameters" };
    }

    return { ok: true, data: { tenantId, userId, accountId, partnerId, chainId, amount } };
};

async function obtainSignature(hash, amount, expires, chainId, partnerId, storeId, token) {
    console.log("MB obtrainSignature", {
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

async function reserveMysteryBox(req) {
    const storeId = 0;
    let transaction;

    try {
        transaction = await db.transaction();
        const token = req.cookies[authTokenName];

        const queryParams = validateParams(req);
        if (!queryParams.ok) return queryParams;

        const { userId, tenantId, chainId, amount } = queryParams.data;

        const storePartnerId = await findStorePartnerId(storeId, tenantId);
        // const reservationInProgress = await isReservationInProgress(userId, storePartnerId);
        // if (reservationInProgress) {
        //     throw new Error("Reservation is already in progress for this user and store");
        // }

        const now = moment.utc().unix();
        const expires = now + 10 * 60;
        const hash = createHash(`${userId}` + `${now}`);

        const reservation = await upsertMysteryBoxLock(userId, storePartnerId, chainId, hash, expires, transaction);

        if (!reservation.ok) {
            return reservation;
        }

        const signature = await obtainSignature(hash, amount, expires, chainId, tenantId, storeId, token);

        if (!signature.ok) {
            await expireMysteryBox(userId, hash);
            return signature;
        }

        await transaction.commit();

        return {
            ok: true,
            hash: reservation.data.hash,
            expires: reservation.data.expireDate,
            signature: signature.data,
            tenantId,
            storeId,
        };
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        logger.error(`ERROR :: [reserveMysteryBox]`, {
            reqQuery: req.query,
            error: serializeError(error),
        });
        return { ok: false, error: error.message };
    }
}

module.exports = { claim, reserveMysteryBox };
