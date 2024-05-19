const { serializeError } = require("serialize-error");
const { QueryTypes } = require("sequelize");
const { models } = require("../services/db/definitions/db.init");
const db = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");

const query_getUserUpgrades = `
    SELECT
        "storeUser"."amount",
        "store"."id" AS "storeId",
        "store"."name" AS "storeName",
        "storePartner"."img" AS "partnerImg"
    FROM
        "storeUser"
            JOIN
        "storePartner" ON "storeUser"."storePartnerId" = "storePartner"."id"
            JOIN
        "store" ON "storePartner"."storeId" = "store"."id"
    WHERE
        "storeUser"."userId" = :userId AND
        "storePartner"."tenantId" = :tenantId;
    `;

async function getUserUpgrades(userId, tenantId) {
    try {
        return await db.query(query_getUserUpgrades, {
            type: QueryTypes.SELECT,
            replacements: { userId, tenantId },
        });
    } catch (error) {
        logger.error("QUERY :: [getUserUpgrades]", {
            error: serializeError(error),
            userId,
        });
        return [];
    }
}

async function getStoreItemsOwnedByUser(userId, tenantId, storeId, transaction) {
    const result = await models.storeUser.findOne({
        where: {
            userId,
        },
        include: [
            {
                model: models.storePartner,
                as: "storePartner", // replace with the correct alias if you have defined one
                where: {
                    tenantId,
                    storeId,
                },
            },
        ],
        attributes: [
            [db.literal('"storePartner"."id"'), "storePartnerId"],
            [db.literal('"storePartner"."storeId"'), "id"],
            "amount",
        ],
        raw: true,
        transaction,
    });

    if (!result) {
        return {
            ok: false,
        };
    }

    return {
        ok: true,
        data: result,
    };
}

async function updateUserUpgradeAmount(userId, storePartnerId, amount, transaction) {
    const result = await models.storeUser.increment(
        { amount },
        { where: { userId, storePartnerId }, raw: true, transaction },
    );

    return {
        ok: result[0][1] === 1,
    };
}

module.exports = {
    getUserUpgrades,
    getStoreItemsOwnedByUser,
    updateUserUpgradeAmount,
};
