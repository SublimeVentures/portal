const { serializeError } = require("serialize-error");
const axios = require("axios");
const logger = require("../../src/lib/logger");
const { getUserLinkedWallets } = require("../queries/wallets.query");
const { authTokenName } = require("../../src/lib/authHelpers");

// async function getAirdropWallets(req) {
//     const { userId, tenantId } = req;
//     try {
//         return await getUserLinkedWallets(userId, tenantId, true);
//     } catch (error) {
//         logger.error("getAirdropWallets", { error: serializeError(error) });
//         return [];
//     }
// }

async function getUserWallets(user) {
    const { userId, tenantId } = user;
    try {
        return await getUserLinkedWallets(userId, tenantId);
    } catch (error) {
        logger.error("getUserWallets", { error: serializeError(error) });
        return [];
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
        logger.error("addUserWallet", { error: serializeError(error) });
        return { ok: false, error: error?.shortMessage };
    }
}

async function removeUserWallet(req) {
    try {
        const token = req.cookies[authTokenName];
        const session = await axios.post(`${process.env.AUTHER}/session/removeWallet`, {
            token,
            address: req.body.address,
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

module.exports = {
    // getAirdropWallets,
    getUserWallets,
    addUserWallet,
    removeUserWallet,
    refreshStaking,
};
