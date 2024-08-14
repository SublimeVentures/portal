const { serializeError } = require("serialize-error");
const axios = require("axios");
const logger = require("../../src/lib/logger");
const { getUserLinkedWallets } = require("../queries/wallets.query");
const { authTokenName } = require("../../src/lib/authHelpers");
const { constructError } = require("../utils/index");

async function getUserWallets(user) {
    const { userId, tenantId } = user;
    try {
        return await getUserLinkedWallets(userId, tenantId);
    } catch (error) {
        return constructError("QUERY", error, { isLog: true, methodName: "getUserWallets" });
    }
}

async function addUserWallet(req) {
    const { address, network } = req.body;

    try {
        const token = req.cookies[authTokenName];

        const session = await axios.post(`${process.env.AUTHER}/session/addWallet`, {
            token,
            address,
            network,
        });

        return session.data;
    } catch (error) {
        return constructError("QUERY", error, { isLog: true, methodName: "addUserWallet" });
    }
}

async function removeUserWallet(req) {
    try {
        const token = req.cookies[authTokenName];
        const session = await axios.post(`${process.env.AUTHER}/session/removeWallet`, { token, address: req.params.address });

        return session.data;
    } catch (error) {
        return constructError("QUERY", error, { isLog: true, methodName: "removeUserWallet" });
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

module.exports = {
    getUserWallets,
    addUserWallet,
    removeUserWallet,
    refreshStaking,
};
