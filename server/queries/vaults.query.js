const db = require('../services/db/definitions/db.init');
const { QueryTypes} = require("sequelize");
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");


const query_getUserVault = `
        SELECT
            "vault"."invested",
            "vault"."claimed",
            "vault"."locked",
            "vault"."createdAt",
            -- Add other vault columns as needed
            "offer"."slug",
            "offer"."name",
            "offer"."tge",
            "offer"."id",
            "offer"."ppu",
            "offer"."ticker",
            "offer"."t_unlock",
            "offer"."isManaged"
            -- Add other offer columns as needed
        FROM
            "vault"
                JOIN
            "offer" ON "vault"."offerId" = "offer"."id"
        WHERE
            "vault"."userId" = :userId AND
            "vault"."invested" != 0 AND
        "offer"."id" IN (
            SELECT DISTINCT "offerId" 
            FROM "offerLimit"
            WHERE "offerLimit"."partnerId" IN (:partnerId, :tenantId)
        )
        ORDER BY
            "vault"."createdAt" DESC;
    `;


async function getUserVault(userId, partnerId, tenantId) {

    try {
        return await db.query(query_getUserVault, {
            type: QueryTypes.SELECT,
            replacements: { userId, partnerId, tenantId },
        });
    } catch (error) {
        logger.error('QUERY :: [getUserVault]', {error: serializeError(error), userId});
        return [];
    }
}



module.exports = { getUserVault}
