const { models } = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");
const { serializeError } = require("serialize-error");

async function getUserReferralClaim(userId) {
    try {
        return await models.referralClaims.findAll({
            where: { userId: userId },
            include: [{ model: models.offer }, { model: models.referralPayouts }]
        })
    } catch (error) {
        logger.error("QUERY :: [getUserReferralClaim]", {
            error: serializeError(error),
            userId,
        });
        return [];
    }
}

module.exports = { getUserReferralClaim };
