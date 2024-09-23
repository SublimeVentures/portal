const { models } = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");
const { serializeError } = require("serialize-error");

async function queryReferralCode(userId) {
    try {
        return await models.referralCodes.findOne({
            where: {
                userId: userId,
            },
            raw: true,
        });

    } catch (error) {
        logger.error("QUERY :: [getReferralCode]", {
            error: serializeError(error),
            userId,
        });
        return null;
    }
}

async function checkReferralHashUniqueness(hash) {
    try {
        const referral = await models.referralCodes.findOne({
            where: { hash: hash },
        });
        return referral === null
    } catch (error) {
        logger.error("QUERY :: [checkReferralHashUniqueness]", {
            error: serializeError(error),
            userId,
            hash
        });
        return true;
    }
}

async function createReferralCode(userId, hash) {
    try {
        return await models.referralCodes.create({
            userId: userId,
            hash: hash
        });

    } catch (error) {
        logger.error("QUERY :: [createReferralCode]", {
            error: serializeError(error),
            userId,
            hash
        });
        return null;
    }
}

async function queryReferrals(inviterId) {
    try {
        return await models.referrals.findAll({
            where: {
                inviterId: inviterId,
            },
            include: {
                model: models.referralPayouts
            },
        });

    } catch (error) {
        logger.error("QUERY :: [getReferralCode]", {
            error: serializeError(error),
            userId,
        });
        return null;
    }
}

async function queryAllUsersReferralData(inviterId) {
    try {
        return await models.referrals.findAll({
            where: {
                inviterId: inviterId,
            },
            include: {
                model: models.referralPayouts,
                include: {
                    model: models.referralClaims,
                    include: {
                        model: models.offer
                    }
                }
            },
        });

    } catch (error) {
        logger.error("QUERY :: [queryAllUsersReferralData]", {
            error: serializeError(error),
            userId,
        });
        return null;
    }
}

async function getAllReferredUsers(userId) {
    try {
        return await models.referrals.findAll({
            where: {
                inviterId: userId,
            }
        });

    } catch (error) {
        logger.error("QUERY :: [getAllReferredUsers]", {
            error: serializeError(error),
            userId,
        });
        return [];
    }
}



module.exports = { queryReferralCode, checkReferralHashUniqueness, createReferralCode, queryReferrals, getAllReferredUsers };
