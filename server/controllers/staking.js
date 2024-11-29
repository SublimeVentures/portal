const { serializeError } = require("serialize-error");
const axios = require("axios");
const logger = require("../../src/lib/logger");
const { authTokenName } = require("../../src/lib/authHelpers");

async function stake(user, req) {
    const { partnerId, tenantId } = req.user;
    const { isDoubleSided } = req.body;

    try {
        const token = req.cookies[authTokenName];
        const { data } = await axios.post(
            `${process.env.AUTHER}/staking/stake`,
            {
                token,
                partnerId,
                tenantId,
                isDoubleSided,
            },
            {
                headers: {
                    "content-type": "application/json",
                },
            },
        );

        return { ok: true, ...data };
    } catch (error) {
        logger.error(`ERROR :: [reserveSpot]`, {
            reqQuery: req.query,
            user,
            error: serializeError(error),
        });

        return { ok: false, error: error?.shortMessage || err?.message };
    }
}

module.exports = { stake };
