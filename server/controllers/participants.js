const { fetchUpgradeUsed } = require("../queries/upgrade.query");
const logger = require("../../src/lib/logger");
const { serializeError } = require("serialize-error");
const { sumAmountForUserAndTenant } = require("../queries/participants.query");

async function userStatusInOffer(user, req) {
    try {
        const { userId, tenantId } = user;
        const offerId = Number(req.params.id);
        const [vault, upgrades] = await Promise.all([
            sumAmountForUserAndTenant(offerId, userId, tenantId),
            fetchUpgradeUsed(userId, offerId, tenantId),
        ]);
        return {
            invested: vault,
            upgrades: upgrades,
        };
    } catch (error) {
        logger.error("ERROR :: [userInvestment]", {
            error: serializeError(error),
            params: req.params,
            user,
        });
        return {
            invested: {
                booked: 0,
                invested: 0,
                total: 0,
            },
            upgrades: {},
        };
    }
}

module.exports = { userStatusInOffer };
