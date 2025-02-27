const { QueryTypes } = require("sequelize");
const { serializeError } = require("serialize-error");
const db = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");

const query_getUserVault = `
    SELECT "vault"."invested",
           "vault"."offerId",
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
    FROM "vault"
             JOIN "offer" ON "vault"."offerId" = "offer"."id"
    WHERE "vault"."userId" = :userId
      AND "vault"."invested" != 0
      AND "offer"."id" IN (SELECT DISTINCT "offerId"
                           FROM "offerLimit"
                           WHERE "offerLimit"."partnerId" IN (:partnerId, :tenantId))

    ORDER BY "vault"."createdAt" DESC;
`;

const query_getUserClaims = `
    SELECT "claim"."isClaimed"
    FROM "claim"
             JOIN "payout" ON claim."payoutId" = payout.id
    WHERE "claim"."offerId" = :offerId
      AND "claim"."userId" = :userId
`;

async function getUserVault(userId, partnerId, tenantId) {
    try {
        const vaults = await db.query(query_getUserVault, {
            type: QueryTypes.SELECT,
            replacements: { userId, partnerId, tenantId },
        });

        return Promise.all(
            vaults.map(async (vault) => {
                const claims = await db.query(query_getUserClaims, {
                    type: QueryTypes.SELECT,
                    replacements: { userId, offerId: vault.offerId },
                });
                return {
                    ...vault,
                    claims,
                };
            }),
        );
    } catch (error) {
        logger.error("QUERY :: [getUserVault]", {
            error: serializeError(error),
            userId,
        });
        return [];
    }
}

module.exports = { getUserVault };
