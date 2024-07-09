const { QueryTypes, Op, Sequelize } = require("sequelize");
const { serializeError } = require("serialize-error");
const db = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");
const { models } = db;

const query_getPendingPayouts = `
    SELECT 
        c.id AS "claimId", 
        c."offerId", 
        c."amount", 
        c."isClaimed", 
        c."createdAt", 
        p."offerPayout" AS "payoutId", 
        p."totalAmount", 
        p."claimDate", 
        p."chainId", 
        p."currency", 
        p."precision",
        p."currencySymbol"
    FROM 
        claim c
    JOIN 
        payout p ON c."payoutId" = p.id
    WHERE 
        c."userId" = :userId AND
        c."offerId" = :offerId AND
        c."isClaimed" = false;
`;

async function getUserPayout(userId, offerId) {
    try {
        return await db.query(query_getPendingPayouts, {
            type: QueryTypes.SELECT,
            replacements: { userId, offerId },
        });
    } catch (error) {
        logger.error("QUERY :: [getUserPayout]", {
            error: serializeError(error),
            userId,
        });
        return [];
    }
}

function createConditions(userId, now, upcomingThreshold, { isSoon, isUpcoming, isPending }) {
    const conditions = {
        offerId: {
            [Op.in]: Sequelize.literal(`(SELECT "offerId" FROM "vault" WHERE "userId" = :userId)`),
        },
    };

    const andConditions = [];

    if (isSoon !== undefined) {
        andConditions.push({
            snapshotDate: { [Op.lte]: now },
            claimDate: { [Op.gte]: now },
        });
    }

    if (isUpcoming !== undefined) {
        andConditions.push({
            claimDate: { [Op.between]: [now, upcomingThreshold] },
        });
    }

    if (isPending !== undefined) {
        andConditions.push({
            claimDate: { [Op.notBetween]: [now, upcomingThreshold] },
        });
    }

    if (andConditions.length > 0) {
        conditions[Op.and] = andConditions;
    }

    return conditions;
}

async function getAllPayouts({
    userId,
    limit = 100,
    offset = 0,
    sortBy = "createdAt",
    sortOrder = "DESC",
    isSoon,
    isUpcoming,
    isPending,
}) {
    try {
        const now = Math.floor(Date.now() / 1000); // Current time in epoch seconds
        const upcomingThreshold = now + 14 * 24 * 60 * 60; // 14 days from now in epoch seconds

        const conditions = createConditions(userId, now, upcomingThreshold, { isSoon, isUpcoming, isPending });

        const isUpcomingLiteral = Sequelize.literal(
            `CASE WHEN "payout"."claimDate" BETWEEN :now AND :upcomingThreshold THEN TRUE ELSE FALSE END`,
        );
        const isPendingLiteral = Sequelize.literal(`CASE WHEN "payout"."claimDate" < :now THEN TRUE ELSE FALSE END`);
        const isSoonLiteral = Sequelize.literal(
            `CASE WHEN :now BETWEEN "payout"."snapshotDate" AND "payout"."claimDate" THEN TRUE ELSE FALSE END`,
        );

        const payouts = await models.payout.findAndCountAll({
            attributes: {
                include: [
                    [isUpcomingLiteral, "isUpcoming"],
                    [isPendingLiteral, "isPending"],
                    [isSoonLiteral, "isSoon"],
                ],
            },
            include: [
                {
                    model: models.offer,
                    required: true,
                },
                {
                    model: models.claim,
                    required: true,
                    where: {
                        userId,
                        payoutId: {
                            [Op.col]: "payout.id",
                        },
                    },
                },
            ],
            where: conditions,
            replacements: {
                userId,
                now,
                upcomingThreshold,
            },
            order: [[sortBy, sortOrder]],
            limit,
            offset,
        });

        return {
            ...payouts,
            limit,
            offset,
        };
    } catch (error) {
        logger.error("QUERY :: [getAllPayouts]", {
            error: serializeError(error),
            userId,
        });
        return { count: 0, rows: [], limit, offset };
    }
}

module.exports = { getUserPayout, getAllPayouts };
