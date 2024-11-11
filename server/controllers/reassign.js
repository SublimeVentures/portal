const { serializeError } = require("serialize-error");
const { checkReassignQueryParams, processReassign, awaitForVaultReassign } = require("../queries/reassign.query");
const { authTokenName } = require("../../src/lib/authHelpers");
const logger = require("../../src/lib/logger");
const { constructError } = require("../utils");

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

async function awaitReassign(req) {
    try {
        const { vaultId } = req.params;
        if (!vaultId) {
            return constructError("CONTROLLER", new Error("Vault id is incorrect!"), {
                isLog: true,
                methodName: "awaitReassign",
            });
        }

        return await awaitForVaultReassign(req);
    } catch (error) {
        return constructError("CONTROLLER", error, { isLog: true, methodName: "awaitReassign" });
    }
}

module.exports = { reassign, awaitReassign };
