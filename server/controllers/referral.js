const crypto = require('crypto');
const { serializeError } = require("serialize-error");
const logger = require("../../src/lib/logger");
const { 
    queryReferralCode,
    createReferralCode,
    checkReferralHashUniqueness,
    queryReferrals,
} = require("../queries/referral.query");


function generateRandomSalt(length = 16) {
    return crypto.randomBytes(length).toString("hex");
}

function generateHash(source) {
    return crypto.createHash('sha256').update(source).digest('hex').substring(0, 7);
}

async function getReferralCode(req) {
    try {
        const { userId } = req.user;
        return await queryReferralCode(userId);
    } catch (error) {
        logger.error(`Can't fetch referral code`, {
            error: serializeError(error),
            params: req.params,
        });
        throw error;
    }
}

async function getReferrals(req) {
    try {
        const { userId } = req.user;
        return await queryReferrals(userId);
    } catch (error) {
        logger.error(`Can't fetch referral code`, {
            error: serializeError(error),
            params: req.params,
        });
        throw error;
    }
}

async function createReferral(req) {
    try {
        const { userId } = req.user;
        const randomSalt = generateRandomSalt();
        let hash;
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 3) {
            attempts++;
            const hashSource = `${userId}${randomSalt}${new Date().getTime()}${attempts}`;
            hash = generateHash(hashSource);
            isUnique = await checkReferralHashUniqueness(hash);
        }

        if (isUnique) {
            return await createReferralCode(userId, hash);
        }

        throw Error("User referral could not be created within 3 tries");
    } catch (error) {
        logger.error(`Can't create referral code`, {
            error: serializeError(error),
            params: req.params,
        });
        throw error;
    }
}

module.exports = { getReferralCode, createReferral, getReferrals };