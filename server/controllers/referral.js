const logger = require("../../src/lib/logger");
const { serializeError } = require("serialize-error");
const { queryReferralCode, createReferralCode, checkReferralHashUniqueness, queryReferrals } = require("../queries/referral.query");
const crypto = require('crypto');

const SALT = 'sublime';

async function getReferralCode(user, req) {
    try {
        const { userId } = user;
        return await queryReferralCode(userId);
    } catch (error) {
        logger.error(`Can't fetch referral code`, {
            error: serializeError(error),
            params: req.params,
        });
        return [];
    }
}

async function getReferrals(user, req) {
    try {
        const { userId } = user;
        return await queryReferrals(userId);
    } catch (error) {
        logger.error(`Can't fetch referral code`, {
            error: serializeError(error),
            params: req.params,
        });
        return [];
    }
}

async function createReferral(user, req) {
    try {
        const { userId } = user;
        const hashSource = String(userId) + SALT + new Date().getTime();
        const hash = crypto.createHash('sha256').update(hashSource).digest('hex').substring(0, 7);
        let isUnique = await checkReferralHashUniqueness(hash);
        let attempts = 0;

        while (!isUnique && attempts < 3) {
            attempts++;
            hash = crypto.createHash('sha256').update(String(userId) + attempts).digest('hex').substring(0, 7);
            isUnique = await checkHashUniqueness(hash);
        }

        if (isUnique) {
            return await createReferralCode(userId, hash);
        }

        throw Error("User referral could not be created within 3 tries")

    } catch (error) {
        logger.error(`Can't create referral code`, {
            error: serializeError(error),
            params: req.params,
        });
        return [];
    }
}

module.exports = { getReferralCode, createReferral, getReferrals };
