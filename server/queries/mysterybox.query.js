const { models } = require("../services/db/definitions/db.init");
const db = require("../services/db/definitions/db.init");
const { Op, Sequelize, QueryTypes } = require("sequelize");
const { MYSTERYBOX_CLAIM_ERRORS, PremiumItemsENUM } = require("../../src/lib/enum/store");
const moment = require("moment");

async function pickMysteryBox(tenantId, transaction) {
    const rolledMysterybox = await models.storeMysterybox.findOne({
        where: {
            userId: {
                [Op.eq]: null,
            },
            tenantId,
        },
        order: [Sequelize.fn("random")],
        raw: true,
        transaction,
    });

    if (!rolledMysterybox) {
        return {
            ok: false,
        };
    }
    return {
        ok: true,
        data: rolledMysterybox,
    };
}

async function assignMysteryBox(userId, mbId, transaction) {
    const assignClaim = await models.storeMysterybox.update(
        {
            userId,
        },
        {
            where: {
                id: mbId,
            },
        },
        { transaction },
    );

    if (!assignClaim) {
        return {
            ok: false,
        };
    }
    return {
        ok: true,
        data: assignClaim,
    };
}

//todo: to be tested

async function processMBAllocation(transaction, claim, userId) {
    const query = `
        INSERT INTO public.vault ("userId", "invested", "offerId", "createdAt", "updatedAt")
        VALUES (${userId}, ${claim.amount}, ${claim.offerId}, now(), now())
            ON CONFLICT ("userId", "offerId") DO
        UPDATE SET "invested" = vault."invested" + EXCLUDED.invested, "updatedAt" = now();

    `;

    const upsert = await db.query(query, {
        type: QueryTypes.UPSERT,
        transaction,
    });

    if (upsert[0] === undefined && upsert[1] === null) {
        return {
            ok: true,
            data: upsert,
        };
    } else {
        return {
            ok: false,
            error: MYSTERYBOX_CLAIM_ERRORS.AllocationAssignment,
        };
    }
}

async function processMBUpgrade(transaction, claim, userId) {
    const query = `
        INSERT INTO public."storeUser" ("userId", "amount", "createdAt", "updatedAt", "storePartnerId")
        VALUES (${userId}, 1, now(), now(), ${claim.storePartnerId})
            ON CONFLICT ("userId", "storePartnerId") DO
        UPDATE SET "amount" = "storeUser"."amount" + EXCLUDED.amount, "updatedAt" = now();

    `;

    const upsert = await db.query(query, {
        type: QueryTypes.UPSERT,
        transaction,
    });
    if (upsert[0] === undefined && upsert[1] === null) {
        return {
            ok: true,
            data: upsert,
        };
    } else {
        return {
            ok: false,
            error: MYSTERYBOX_CLAIM_ERRORS.UpgradeAssignment,
        };
    }
}

async function findStorePartnerId(storeId, tenantId) {
    const storePartnerRecord = await models.storePartner.findOne({
        where: {
            storeId: storeId,
            tenantId: tenantId
        }
    });

    if (!storePartnerRecord) {
        throw new Error(`StorePartner not found for storeId: ${storeId} and tenantId: ${tenantId}`);
    }

    return storePartnerRecord.id;
}

async function upsertMysteryBoxLock(userId, storePartnerId, chainId, hash, expires, transaction) {
    const mysteryBoxQuery = `
        INSERT INTO public."mysteryBoxLock" ("userId", "storePartnerId", "hash", "chainId", "expireDate", "isExpired", "isFinished", "createdAt", "updatedAt")
        VALUES (:userId, :storePartnerId, :hash, :chainId, :expireDate, false, false, NOW(), NOW())
        ON CONFLICT ("hash") DO
        UPDATE SET "expireDate" = EXCLUDED."expireDate", "isExpired" = false, "isFinished" = false, "updatedAt" = NOW()
        RETURNING *;
    `;

    const result = await db.query(mysteryBoxQuery, {
        replacements: {
            userId,
            storePartnerId,
            hash,
            chainId,
            expireDate: expires
        },
        type: QueryTypes.RAW,
        transaction,
    });

    if (result[1] !== 1) {
        return {
            ok: false,
        };
    }

    return {
        ok: true,
        data: result[0][0], 
    };
}

async function isReservationInProgress(userId, storePartnerId) {
    try {
        const ongoingReservation = await models.mysteryBoxLock.findOne({
            where: {
                userId,
                storePartnerId,
                isExpired: false, 
                isFinished: false,
                expireDate: {
                    [Op.gt]: moment().unix() 
                }
            }
        });

        return !!ongoingReservation;
    } catch (error) {
        throw new Error('Failed to check reservation status');
    }
}

module.exports = {
    pickMysteryBox,
    assignMysteryBox,
    processMBAllocation,
    processMBUpgrade,
    findStorePartnerId,
    upsertMysteryBoxLock,
    isReservationInProgress,
};
