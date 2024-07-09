const { Op, Sequelize } = require("sequelize");
const { serializeError } = require("serialize-error");
const { models } = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");

async function getUserVault(
    userId,
    partnerId,
    tenantId,
    { limit = 100, sortBy = "createdAt", sortOrder = "DESC", offset = 0, isUpcoming, canClaim },
) {
    try {
        // Optimize the vested calculation
        const vestedSubquery = `
        (
            SELECT COALESCE(SUM((elem->>'p')::numeric), 0)
            FROM unnest("offer"."t_unlock") AS elem
            WHERE (elem->>'c')::numeric != 0
        )`;

        // Simplified nextClaimDate calculation
        const nextClaimDateSubquery = `
        (
            SELECT MIN(GREATEST(
                COALESCE(NULLIF((elem->>'c')::bigint, 0), 0), 
                COALESCE(NULLIF((elem->>'s')::bigint, 0), 0)
            ))
            FROM unnest("offer"."t_unlock") AS elem
            WHERE 
                (elem->>'c')::bigint > EXTRACT(EPOCH FROM NOW())
                OR (elem->>'s')::bigint > EXTRACT(EPOCH FROM NOW())
        )`;

        const nextClaimDateFilter = `
        (
            ${nextClaimDateSubquery} <= EXTRACT(EPOCH FROM NOW()) + 1209600
        )`;

        // Optimize lastNonZeroCIndexSubquery
        const lastNonZeroCIndexSubquery = `
        (
            SELECT idx
            FROM (
                SELECT 
                    row_number() OVER () - 1 AS idx,
                    (elem->>'c')::numeric AS c
                FROM unnest("offer"."t_unlock") AS elem
                ORDER BY idx DESC
            ) AS sub
            WHERE sub.c != 0
            LIMIT 1
        )`;

        const isClaimedCheckSubquery = `
        (
            SELECT COUNT(*)
            FROM claim
            WHERE
                claim."payoutId" = (${lastNonZeroCIndexSubquery})
                AND claim."offerId" = "offer"."id"
                AND claim."userId" = :userId
                AND claim."isClaimed" = true
        ) > 0`;

        const athSubquery = `
        (
            SELECT COALESCE(SUM("claim"."amount" * "offer"."ath"), 0)
            FROM "claim"
            WHERE "claim"."offerId" = "vault"."offerId" AND "claim"."userId" = :userId
        )`;

        const result = await models.vault.findAndCountAll({
            attributes: [
                "invested",
                "claimed",
                "locked",
                "createdAt",
                "refund",
                [Sequelize.literal(`${vestedSubquery}`), "vested"],
                [Sequelize.literal(`"vault"."claimed" / NULLIF("vault"."invested", 0)`), "performance"],
                [Sequelize.literal(`${isClaimedCheckSubquery}`), "canClaim"],
                [Sequelize.literal(`${nextClaimDateSubquery}`), "nextClaimDate"],
                [Sequelize.literal(`${athSubquery}`), "ath"],
            ],
            include: [
                {
                    model: models.offer,
                    attributes: ["slug", "name", "tge", "id", "ppu", "ticker", "t_unlock", "isManaged"],
                    required: true,
                    include: [
                        {
                            model: models.offerLimit,
                            attributes: [],
                            where: {
                                partnerId: {
                                    [Op.in]: [partnerId, tenantId],
                                },
                            },
                            required: true,
                        },
                    ],
                },
            ],
            where: {
                userId,
                invested: {
                    [Op.ne]: 0,
                },
                ...(isUpcoming || canClaim
                    ? {
                          [Op.and]: [
                              ...(isUpcoming ? [Sequelize.literal(nextClaimDateFilter)] : []),
                              ...(canClaim ? [Sequelize.literal(isClaimedCheckSubquery)] : []),
                          ],
                      }
                    : {}),
            },
            replacements: { userId, partnerId, tenantId },
            order: [[sortBy, sortOrder]],
            limit,
            offset,
        });

        return result; // Return the result here
    } catch (error) {
        logger.error("QUERY :: [getUserVault]", {
            error: serializeError(error),
            userId,
        });
        return { count: 0, rows: [] };
    }
}

async function getUserVaultStats(userId) {
    try {
        const totalClaimAmountSubquery = Sequelize.literal(`(
            SELECT COALESCE(SUM(
                "claim"."amount" * 
                CASE 
                    WHEN "offer"."isManaged" = false THEN "offer"."ath" 
                    ELSE 1 
                END
            ), 0)
            FROM "claim"
            INNER JOIN "offer" ON "claim"."offerId" = "offer"."id"
            WHERE "claim"."userId" = :userId
        )`);

        const result = await models.vault.findAll({
            attributes: [
                [Sequelize.cast(Sequelize.fn("COUNT", Sequelize.col("vault.id")), "integer"), "count"],
                [Sequelize.cast(Sequelize.fn("SUM", Sequelize.col("vault.invested")), "decimal"), "invested"],
                [Sequelize.cast(Sequelize.fn("SUM", Sequelize.col("vault.claimed")), "decimal"), "claimed"],
                [Sequelize.cast(Sequelize.fn("SUM", Sequelize.col("vault.locked")), "decimal"), "locked"],
                [Sequelize.cast(totalClaimAmountSubquery, "decimal"), "return"],
            ],
            where: {
                userId,
                invested: {
                    [Op.ne]: 0,
                },
            },
            replacements: { userId },
            raw: true,
        });

        const stats = result[0];
        return stats;
    } catch (error) {
        logger.error("QUERY :: [getUserVault]", {
            error: serializeError(error),
            userId,
        });
        return {
            count: 0,
            invested: 0,
            claimed: 0,
            locked: 0,
            return: 0,
        };
    }
}

module.exports = { getUserVault, getUserVaultStats };
