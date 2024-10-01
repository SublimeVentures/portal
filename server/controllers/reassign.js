const { serializeError } = require("serialize-error");
const { checkReassignQueryParams, processReassign } = require("../queries/reassign.query");
const { authTokenName } = require("../../src/lib/authHelpers");
const logger = require("../../src/lib/logger");

async function reassign(req, user) {
    try {
        const queryParams = checkReassignQueryParams(req);
        if (!queryParams.ok) return queryParams;

        const token = req.cookies[authTokenName];

        const reassignRes = await processReassign(queryParams.data, token);

        if (!reassignRes.ok) return reassignRes;

        return {
            ok: true,
            expire: reassignRes.reassign._expire,
            signature: reassignRes.signature.data,
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
