const db = require("../services/db/definitions/db.init");
const { models } = require("../services/db/definitions/db.init");
const { QueryTypes } = require("sequelize");
const logger = require("../../src/lib/logger");
const { serializeError } = require("serialize-error");

async function getUserReferralClaim(userId) {
    try {
        return await models.referralClaim.findAll({
            where: { userId: userId },
            include: [{ model: models.offer }, { model: models.referralPayout }]
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
