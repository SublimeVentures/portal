const { Op, QueryTypes } = require("sequelize");
const moment = require("moment");
const { models } = require("../services/db/definitions/db.init");
const db = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");

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
            storeId,
            tenantId,
        },
    });

    if (!storePartnerRecord) {
        throw new Error(`StorePartner not found for storeId: ${storeId} and tenantId: ${tenantId}`);
    }

    return storePartnerRecord.id;
}

async function upsertUpgradeLock(userId, upgradeId, chainId, hash, expires) {
    const storeQuery = `
        INSERT INTO public."upgradeLock" ("userId", "storePartnerId", "hash", "chainId", "expireDate", "isExpired", "isFinished", "createdAt", "updatedAt")
        VALUES (:userId, :storePartnerId, :hash, :chainId, :expireDate, false, false, NOW(), NOW())
        ON CONFLICT ("hash") DO
        UPDATE SET "expireDate" = EXCLUDED."expireDate", "isExpired" = false, "isFinished" = false, "updatedAt" = NOW()
        RETURNING *;
    `;

    const result = await db.query(storeQuery, {
        replacements: {
            userId,
            storePartnerId: upgradeId,
            hash,
            chainId,
            expireDate: expires,
        },
        type: QueryTypes.RAW,
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

async function expireUpgrade(userId, hash) {
    try {
        const upgradeLockQuery = `
            UPDATE public."upgradeLock"
            SET "isExpired" = true,
                "updatedAt" = now()
            WHERE "userId" = :userId
              AND "hash" = :hash;
        `;

        return await db.query(upgradeLockQuery, {
            replacements: {
                userId,
                hash,
            },
            type: QueryTypes.UPDATE,
        });
    } catch (e) {
        logger.error(`ERROR :: [expireUpgrade] for user ${userId} | hash: ${hash}`, {
            userId,
            hash,
        });
    }
    return true;
}


async function getUpgradeReservations(userId, tenantId, storeId) {
    const storePartnerId = await findStorePartnerId(storeId, tenantId);

    try {
        const reservedItems = await models.upgradeLock.findAll({
            where: {
                userId,
                storePartnerId,
                isExpired: false,
            }
        });
        
        return reservedItems;
    } catch (error) {
        logger.error(
            `ERROR :: [getUpgradeReservations] for user ${userId} | tenantId - ${tenantId}, storeId - ${storeId}`,
            {
                userId,
                hash,
            },
        );
    }
    return true;
}

module.exports = {
    saveUpgradeUse,
    fetchUpgradeUsed,
    findStorePartnerId,
    upsertUpgradeLock,
    expireUpgrade,
    getUpgradeReservations
};
