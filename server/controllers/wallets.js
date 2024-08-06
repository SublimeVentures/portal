const { serializeError } = require("serialize-error");
const axios = require("axios");
const logger = require("../../src/lib/logger");
const { getUserLinkedWallets } = require("../queries/wallets.query");
const { authTokenName } = require("../../src/lib/authHelpers");

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
        const session = await axios.post(`${process.env.AUTHER}/session/addWallet`, {
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
        const session = await axios.post(`${process.env.AUTHER}/session/removeWallet`, {
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
        const session = await axios.post(`${process.env.AUTHER}/session/stake`, { token, address });
        return session.data;
    } catch (error) {
        logger.error("refreshStaking", { error: serializeError(error) });
        return { ok: false, error: error?.shortMessage };
    }
}

async function checkUserWalletsForStaking(req) {
    try {
        const token = req.cookies[authTokenName];
        const { data } = await axios.post(`${process.env.AUTHER}/session/stake/check`, { token });
        return data;
    } catch (error) {
        logger.error("checkStakingWallet", { error: serializeError(error) });
        return { ok: false, error: error?.shortMessage };
    }
}

module.exports = {
    getUserWallets,
    addUserWallet,
    removeUserWallet,
    refreshStaking,
    checkUserWalletsForStaking,
};
