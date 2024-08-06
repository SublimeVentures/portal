const { serializeError } = require("serialize-error");
const { models } = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");

async function getUserAirdropWallets(userId, tenantId) {
    try {
        return models.userWallet.findAll({
            attributes: ["wallet", "isStaking", "isDelegate", "isHolder", "isAirdrop"],
            where: {
                tenantId,
                userId,
                isActive: true,
                isAirdrop: true,
            },
            raw: true,
        });
    } catch (error) {
        logger.error("QUERY :: [getUserAirdropWallets]", {
            error: serializeError(error),
        });
    }
    return [];
}

async function getUserLinkedWallets(userId, tenantId) {
    try {
        return models.userWallet.findAll({
            attributes: ["wallet", "isStaking", "isDelegate", "isHolder", "isAirdrop"],
            where: {
                tenantId,
                userId,
                isActive: true,
            },
            raw: true,
        });
    } catch (error) {
        logger.error("QUERY :: [getUserLinkedWallets]", {
            error: serializeError(error),
        });
    }
    return [];
}

module.exports = { getUserAirdropWallets, getUserLinkedWallets };
