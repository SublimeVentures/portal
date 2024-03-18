const logger = require("../../src/lib/logger");
const { serializeError } = require("serialize-error");
const { getUserPayout } = require("../queries/payout.query");

async function userPayout(user, req) {
    try {
        const { userId } = user;
        const offerId = Number(req.params.id);
        return await getUserPayout(userId, offerId);
    } catch (error) {
        logger.error(`Can't fetch userPayout`, {
            error: serializeError(error),
            params: req.params,
        });
        return [];
    }
}

module.exports = { userPayout };
