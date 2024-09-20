const { serializeError } = require("serialize-error");
const logger = require("../../src/lib/logger");
const { getUserLinkedWallets } = require("../queries/wallets.query");
const { authTokenName } = require("../../src/lib/authHelpers");
const { axiosAutherPublic } = require("../services/request/axios");

async function getUserWallets(user) {
    const { userId, tenantId } = user;
    try {
        return await getUserLinkedWallets(userId, tenantId);
    } catch (error) {
        logger.error("getUserWallets", { error: serializeError(error) });
        return [];
    }
}

async function addUserWallet(user, req) {
    try {
        const token = req.cookies[authTokenName];
        const session = await axiosAutherPublic.post("/session/addWallet", {
            token,
            signature: req.body.signature,
        });
        return session.data;
    } catch (error) {
        logger.error("addUserWallet", { error: serializeError(error) });
        return { ok: false, error: error?.shortMessage };
    }
}

async function removeUserWallet(user, req) {
    try {
        const token = req.cookies[authTokenName];
        const session = await axiosAutherPublic.post("/session/removeWallet", {
            token,
            signature: req.body.signature,
        });
        return session.data;
    } catch (error) {
        logger.error("removeUserWallet", { error: serializeError(error) });
        return { ok: false, error: error?.shortMessage };
    }
}

async function refreshStaking(req, address) {
    try {
        const token = req.cookies[authTokenName];
        const session = await axiosAutherPublic.post("/session/stake", {
            token,
            address,
        });

        return session.data;
    } catch (error) {
        logger.error("refreshStaking", { error: serializeError(error) });
        return { ok: false, error: error?.shortMessage };
    }
}

module.exports = {
    getUserWallets,
    addUserWallet,
    removeUserWallet,
    refreshStaking,
};
