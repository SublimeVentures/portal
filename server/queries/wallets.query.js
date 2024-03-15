const { models } = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");
const { serializeError } = require("serialize-error");

async function getUserLinkedWallets(userId) {
    try {
        return models.userWallet.findAll({
            attributes: ["wallet", "isStaking", "isDelegate"],
            where: {
                userId,
                isActive: true,
            },
            raw: true,
        });
    } catch (error) {
        logger.error("QUERY :: [getOffersPublic]", {
            error: serializeError(error),
        });
    }
    return [];
}

module.exports = { getUserLinkedWallets };
