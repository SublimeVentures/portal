const express = require("express");
const router = express.Router();
const { getUserWallets, addUserWallet, removeUserWallet, refreshStaking } = require("../controllers/wallets");
const { refreshCookies } = require("../controllers/login/tokenHelper");

router.get("/wallets", async (req, res) => {
    const { user } = req;
    res.status(200).json(await getUserWallets(user));
});

router.post("/wallets/:operation", async (req, res) => {
    const { user } = req;
    try {
        let result;

        if (req.params.operation === "add") {
            result = await addUserWallet(user, req);
        } else if (req.params.operation === "remove") {
            result = await removeUserWallet(user, req);
        } else {
            return res.status(200).json({});
        }

        const session = await refreshCookies(result.token);

        if (result.ok) {
            const cookies = [session.cookie.refreshCookie ?? "", session.cookie.accessCookie ?? ""];
            res.setHeader("Set-Cookie", cookies);
            delete result.data.user;
            delete result.token;
            delete result.cookie;
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log("error", error);
        return res.status(200).json({});
    }
});

router.post("/stake", async (req, res) => {
    const { user, ...request } = req;
    const isUserWallet = user.wallets.find((el) => el === request.body.address);
    if (!isUserWallet) return res.status(400).json({});

    const result = await refreshStaking(request, isUserWallet);

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
