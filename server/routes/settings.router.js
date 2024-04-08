const express = require("express");
const router = express.Router();
const { verifyID } = require("../../src/lib/authHelpers");
const { getUserWallets, addUserWallet, removeUserWallet, refreshStaking } = require("../controllers/wallets");
const { refreshCookies } = require("../controllers/login/tokenHelper");
const { authTokenName } = require("../../src/lib/authHelpers");

router.get("/wallets", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    res.status(200).json(await getUserWallets(user));
});

router.post("/wallets/:operation", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    const token = req.cookies[authTokenName];
    const session = await refreshCookies(token);
    let result;

    if (req.params.operation === "add") {
        result = await addUserWallet(user, req);
    } else if (req.params.operation === "remove") {
        result = await removeUserWallet(user, req);
    } else {
        return res.status(200).json({});
    }

    if (result.ok) {
        const cookies = [session.cookie.refreshCookie ?? '', session.cookie.accessCookie ?? ''];
        res.setHeader("Set-Cookie", cookies);
        delete result.data.user;
        delete result.token;
        delete result.cookie;
    }

    return res.status(200).json(result);
});

router.post("/stake", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});
    const isUserWallet = user.wallets.find((el) => el === req.body.address);
    if (!isUserWallet) return res.status(400).json({});

    const result = await refreshStaking(req, isUserWallet);
    const session = await refreshCookies(result.token);

    if (result.ok) {
        const cookies = [session.cookie.refreshCookie, session.cookie.accessCookie];
        res.setHeader("Set-Cookie", cookies);
        delete result.data.user;
        delete result.token;
        delete result.cookie;
    }
    return res.status(200).json(result);
});

module.exports = { router };
