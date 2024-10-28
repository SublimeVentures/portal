const axios = require("axios");
const moment = require("moment");
const { serializeError } = require("serialize-error");
const {
    pickMysteryBox,
    assignMysteryBox,
    processMBAllocation,
    processMBUpgrade,
    findStorePartnerId,
    getMysteryBoxReservations,
    upsertMysteryBoxLock,
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
const { isNumber } = require("web3-validator");

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

async function reserve(req) {
    try {
        const { body, user } = req;
        const { chainId, amount, storeId } = body;
        const { userId, tenantId, accountId } = user;
    
        if (!isNumber(storeId) || !userId || !accountId || !chainId || !amount || !isNumber(tenantId)) {
            return { ok: false, error: "Missing required parameters" };
        }
    
        const storePartnerId = await findStorePartnerId(storeId, tenantId);
        const now = moment.utc().unix();
        const expireDate = now + 15 * 60;
        const hash = createHash(`${userId}` + `${now}`);

        const reservation = await upsertMysteryBoxLock(userId, storePartnerId, chainId, hash, expireDate);

        if (!reservation.ok) {
            return reservation
        }

        return {
            ok: true,
            hash,
            expireDate,
            tenantId,
            storePartnerId,
            storeId,
        };
    } catch (error) {
        logger.error(`ERROR :: [MysteryBox - reserve]`, {
            reqQuery: req.query,
            error: serializeError(error),
        });
        return { ok: false, error: error.message };
    }
}

async function sign(req) {
    try {
        const token = req.cookies[authTokenName];

        const { body, user } = req;
        const { chainId, amount, storeId, hash, expires } = body;
        const { userId, tenantId } = user;
    
        if (!isNumber(storeId) || !userId || !chainId || !amount || !isNumber(tenantId)) {
            return { ok: false, error: "Missing required parameters" };
        }

        const storePartnerId = await findStorePartnerId(storeId, tenantId);
        const signature = await obtainSignature(hash, amount, expires, chainId, tenantId, storeId, token);

        if (!signature.ok) {
            await expireUpgrade(userId, hash);
            return signature;
        }

        return {
            ok: true,
            hash,
            expires,
            signature: signature.data,
            tenantId,
            storePartnerId,
            storeId,
        };
    } catch (error) {
        logger.error(`ERROR :: [MysteryBox - sign]`, {
            reqQuery: req.query,
            error: serializeError(error),
        });
        return { ok: false, error: error.message };
    }
}

const removeBooking = async (req) => {
    try {
        const { body: { hash }, user: { userId } } = req;
    
        if (!hash || !userId) {
            return { ok: false, error: "Missing required parameters | removeUpgradeBooking" };
        }

        const result = await expireMysteryBox(userId, hash);

        return {
            ok: true,
            result
        };
    } catch (error) {
        logger.error(`ERROR :: [MysteryBox removeBooking]`, {
            reqQuery: req.query,
            error: serializeError(error),
        });
        return { ok: false, error: error.message };
    }
}


async function getReservedMysteryBox(req) {
    try {
        const {
            body: { userId, tenantId, storeId },
        } = req;
        if (!userId || !isNumber(tenantId) || !isNumber(storeId)) {
            return { ok: false, error: "Missing required parameters" };
        }
    
        return await getMysteryBoxReservations(userId, tenantId, storeId);
    } catch (e) {
        logger.error(`ERROR :: [getReservedMysteryBox]`, {
            reqQuery: req.query,
            error: serializeError(error),
        });
        return { ok: false, error: error.message };
    }
}

module.exports = { claim, reserve, removeBooking, sign, getReservedMysteryBox };
