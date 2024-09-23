const { Op, Sequelize } = require("sequelize");
const { serializeError } = require("serialize-error");
const { models } = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");
const { constructError } = require("../utils");

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
            SELECT COALESCE(SUM("payout"."percentage"), 0)
            FROM "payout"
            WHERE "payout"."offerId" = "offer"."id"
                AND "payout"."claimDate" != 0
        )`;

        // Simplified nextClaimDate calculation
        const nextClaimDateSubquery = `
        (
            SELECT MIN(GREATEST(
                COALESCE(NULLIF("payout"."snapshotDate", 0), 0), 
                COALESCE(NULLIF("payout"."claimDate", 0), 0)
            ))
            FROM "payout"
            WHERE "payout"."offerId" = "offer"."id"
                AND "payout"."snapshotDate" > EXTRACT(EPOCH FROM NOW())
                    OR "payout"."claimDate" > EXTRACT(EPOCH FROM NOW())
        )`;

        const nextClaimDateFilter = `
        (
            ${nextClaimDateSubquery} <= EXTRACT(EPOCH FROM NOW()) + 1209600
        )`;

        const isClaimedCheckSubquery = `
        (
            SELECT COUNT(*)
            FROM claim
            WHERE claim."offerId" = "offer"."id"
                AND claim."userId" = :userId
                AND claim."isClaimed" = false
        ) > 0`;

        const athSubquery = `
        (
            SELECT COALESCE(SUM("claim"."amount" * "offer"."ath"), 0)
            FROM "claim"
            WHERE "claim"."offerId" = "vault"."offerId"
                AND "claim"."userId" = :userId
        )`;

        const result = await models.vault.findAndCountAll({
            attributes: [
                "invested",
                "claimed",
                "locked",
                "createdAt",
                "refund",
                "id",
                [Sequelize.literal(`${vestedSubquery}`), "vested"],
                [Sequelize.literal(`"vault"."claimed" / NULLIF("vault"."invested", 0)`), "performance"],
                [Sequelize.literal(`${isClaimedCheckSubquery}`), "canClaim"],
                [Sequelize.literal(`${nextClaimDateSubquery}`), "nextClaimDate"],
                [Sequelize.literal(`${athSubquery}`), "ath"],
                [Sequelize.literal(`((("offer"."tge" - "offer"."ppu") / NULLIF("offer"."ppu", 0)) * 100)`), "tge_gain"],
            ],
            include: [
                {
                    model: models.offer,
                    attributes: ["slug", "name", "tge", "id", "ppu", "ticker", "isManaged"],
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
                        {
                            model: models.payout,
                            required: false,
                            separate: true,
                            order: [["offerPayout", "ASC"]],
                            include: [
                                {
                                    model: models.claim,
                                    where: {
                                        userId,
                                    },
                                    required: false,
                                },
                            ],
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
            order: [
                sortBy === "performance"
                    ? [Sequelize.literal(`"vault"."claimed" / NULLIF("vault"."invested", 0)`), sortOrder]
                    : [sortBy, sortOrder],
            ],
            limit,
            offset,
        });

        const processedRows = result.rows.map((vault) => {
            const offer = vault.offer;

            // Find the nextPayout based on future snapshotDate or claimDate
            const nextPayout =
                offer.payouts
                    .filter(
                        (payout) =>
                            payout.snapshotDate > Math.floor(Date.now() / 1000) ||
                            payout.claimDate > Math.floor(Date.now() / 1000),
                    )
                    .sort((a, b) => b.offerPayout - a.offerPayout)[0] || null;

            // Find the currentPayout based on the highest offerPayout where claim.isClaimed is false
            const currentPayout =
                offer.payouts
                    .filter((payout) => payout.claims.some((claim) => !claim.isClaimed))
                    .sort((a, b) => b.offerPayout - a.offerPayout)[0] || null;

            return {
                ...vault.toJSON(),
                nextPayout, // Add filtered nextPayout
                currentPayout, // Add filtered currentPayout
            };
        });

        return { count: result.count, rows: processedRows };
    } catch (error) {
        return constructError("QUERY", error, { isLog: true, methodName: "getUserVault" });
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
