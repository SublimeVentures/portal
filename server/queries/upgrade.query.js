const { models } = require("../services/db/definitions/db.init");
const db = require("../services/db/definitions/db.init");
const { Op, QueryTypes } = require("sequelize");
const { UPGRADE_ERRORS } = require("../enum/UpgradeErrors");

async function fetchUpgradeUsed(userId, offerId, tenantId, transaction) {
    return await models.upgrade.findAll({
        attributes: [
            "amount",
            "alloUsed",
            "alloMax",
            "isExpired",
            [db.col("storePartner.storeId"), "id"],
        ],
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

async function saveUpgradeUse(
    userId,
    storePartnerId,
    offerId,
    amount,
    allocation,
    transaction,
) {
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

module.exports = { saveUpgradeUse, fetchUpgradeUsed };
