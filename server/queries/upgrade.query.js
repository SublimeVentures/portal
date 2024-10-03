const { models } = require("../services/db/definitions/db.init");
const db = require("../services/db/definitions/db.init");
const { Op, QueryTypes } = require("sequelize");
const { UPGRADE_ERRORS } = require("../enum/UpgradeErrors");
const moment = require("moment");

async function fetchUpgradeUsed(userId, offerId, tenantId, transaction) {
    return await models.upgrade.findAll({
        attributes: ["amount", "alloUsed", "alloMax", "isExpired", [db.col("storePartner.storeId"), "id"]],
        include: [
            {
                model: models.storePartner,
                as: "storePartner",
                attributes: [],
                where: {
                    tenantId,
                },
            },
        ],
        where: {
            userId,
            offerId,
            amount: {
                [Op.gt]: 0,
            },
        },
        raw: true,
        nest: true,
        transaction,
    });
}

async function saveUpgradeUse(userId, storePartnerId, offerId, amount, allocation, transaction) {
    const query = `
        INSERT INTO public."upgrade" ("userId", "storePartnerId", "offerId", "amount",  "alloMax", "createdAt", "updatedAt")
        VALUES (${userId}, ${storePartnerId}, ${offerId}, ${amount}, ${allocation ? allocation : 0}, now(), now())
            ON CONFLICT ("userId", "storePartnerId", "offerId") DO
        UPDATE SET "amount" = "upgrade"."amount" + EXCLUDED.amount, "updatedAt" = now();
    `;

    const upsert = await db.query(query, {
        type: QueryTypes.UPSERT,
        transaction,
    });
    if (upsert[0] === undefined && upsert[1] === null) {
        return { ok: true };
    } else {
        return {
            ok: false,
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

async function upsertUpgradeLock(userId, upgradeId, chainId, hash, expires, transaction) {
    const mysteryBoxQuery = `
        INSERT INTO public."upgradeLock" ("userId", "storePartnerId", "hash", "chainId", "expireDate", "isExpired", "isFinished", "createdAt", "updatedAt")
        VALUES (:userId, :storePartnerId, :hash, :chainId, :expireDate, false, false, NOW(), NOW())
        ON CONFLICT ("hash") DO
        UPDATE SET "expireDate" = EXCLUDED."expireDate", "isExpired" = false, "isFinished" = false, "updatedAt" = NOW()
        RETURNING *;
    `;

    const result = await db.query(mysteryBoxQuery, {
        replacements: {
            userId,
            storePartnerId: upgradeId,
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

async function isReservationInProgress(userId, storeId) {
    try {
        const ongoingReservation = await models.upgradeLock.findOne({
            where: {
                userId,
                storePartnerId: storeId,
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
    saveUpgradeUse,
    fetchUpgradeUsed,
    findStorePartnerId,
    upsertUpgradeLock,
    isReservationInProgress,
};
