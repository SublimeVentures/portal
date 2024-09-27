const axios = require("axios");
const { serializeError } = require("serialize-error");
const { checkReassignQueryParams, processReassign } = require("../queries/reassign.query");
const { authTokenName } = require("@/lib/authHelpers");
const logger = require("@/lib/logger");
const { ReassignErrorsENUM } = require("@/lib/enum/reassign");

async function obtainSignature(to, currency, offer, expire, token) {
    const signature = await axios.post(
        `${process.env.AUTHER}/reassign/sign`,
        {
            to,
            currency,
            offer,
            expire,
            token,
        },
        {
            headers: {
                "content-type": "application/json",
            },
        },
    );
    if (!signature?.data?.ok) {
        return {
            ok: false,
            code: ReassignErrorsENUM.BAD_SIGNATURE,
        };
    }

    return {
        ok: true,
        data: signature.data.data,
    };
}

async function reassign(user, req) {
    try {
        const queryParams = checkReassignQueryParams(req);
        if (!queryParams.ok) return queryParams;

        const reassign = await processReassign(queryParams.data, user);
        if (!reassign.ok) return reassign;

        const token = req.cookies[authTokenName];

        const signature = await obtainSignature(
            reassign._to,
            reassign._currency,
            reassign._offer,
            reassign._expire,
            token,
        );

        if (!signature.ok) {
            return signature;
        }

        return {
            ok: true,
            expire: reassign._expire,
            signature: signature.data,
        };
    } catch (error) {
        logger.error(`ERROR :: [reassign]`, {
            reqQuery: req.query,
            user,
            error: serializeError(error),
        });
        return { ok: false };
    }
}

module.exports = { reassign };
