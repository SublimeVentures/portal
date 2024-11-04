const express = require("express");
const router = express.Router();
const axios = require("axios");
const { serializeError } = require("serialize-error");
const { refreshTokenName, authTokenName } = require("../../src/lib/authHelpers");
const logger = require("../../src/lib/logger");
const { envCache } = require("../controllers/envionment");
const { verifyID, buildCookie, refreshData } = require("../../src/lib/authHelpers");
const { refreshCookies } = require("../controllers/login/tokenHelper");
const { ipMiddleware } = require("../middleware/ipMiddleware");

//LOGIN USER
router.post("/login", ipMiddleware, async (req, res) => {
    try {
        const { message, signature, tenant, partner } = req.body || {};
        if (!message || !signature || !tenant || !partner) {
            return res.status(400).json({});
        }

        const auth = await axios.post(
            `${process.env.AUTHER}/auth/login`,
            { ...req.body, userCountry: req.userCountry },
            {
                headers: {
                    "content-type": "application/json",
                },
            },
        );

        const result = auth.data;

        if (!result?.ok) throw Error(result?.error);

        envCache.set(`${tenant}:${partner}`, result.env);

        const session = await refreshCookies(result.token);

        if (!session?.ok) throw Error("Error generating cookies");

        const cookies = [session.cookie.refreshCookie, session.cookie.accessCookie];

        res.setHeader("Set-Cookie", cookies);

        delete result.token;
        delete result.env;

        return res.status(200).json(result);
    } catch (error) {
        logger.error(`LOGIN USER`, { error: serializeError(error), body: req.body });
        return res.status(400).json({});
    }
});

//LOG OUT
router.delete("/login", async (req, res) => {
    try {
        if (!req.body.softLogout) {
            const { auth } = await verifyID(req);
            if (!auth) return res.status(401).json({});

            const token = req.cookies[authTokenName];
            const authData = await axios.delete(`${process.env.AUTHER}/auth/login`, { data: { token } });
            const result = authData.data;
            if (!result?.ok) throw Error("Bad AUTHER response");
        }

        const accessCookie = buildCookie(authTokenName, null, -1);
        const refreshCookie = buildCookie(refreshTokenName, null, -1);
        const cookies = [refreshCookie, accessCookie];
        res.setHeader("Set-Cookie", cookies);
        return res.status(200).json({ ok: true });
    } catch (error) {
        logger.error(`ERROR :: LOGOUT USER`, {
            error: serializeError(error),
            body: req.body,
            cookie: req.cookies[authTokenName],
        });
        const accessCookie = buildCookie(authTokenName, null, -1);
        const refreshCookie = buildCookie(refreshTokenName, null, -1);
        const cookies = [refreshCookie, accessCookie];
        res.setHeader("Set-Cookie", cookies);
        return res.status(400).json({ ok: false });
    }
});

//REFRESH TOKEN
router.put("/login", async (req, res) => {
    try {
        const token = req.cookies[refreshTokenName];
        console.log("refresh", token);

        if (!token) {
            return res.status(400).send({ ok: false, error: "Token is required" });
        }

        const { auth, user } = await verifyID(req, true);
        if (!auth) return res.status(401).json({ ok: false, error: "Not authorized" });

        const userData = await refreshData(token);
        if (!userData?.ok) throw Error("Bad AUTHER response");

        const refresh = await refreshCookies(userData.token);
        if (!refresh) return res.status(403).json({ ok: false, error: "Refresh failed" });

        if (!refresh?.ok) throw Error("Error generating cookies");

        const cookies = [refresh.cookie.refreshCookie, refresh.cookie.accessCookie];
        res.setHeader("Set-Cookie", cookies);

        return res.status(200).json(userData.data);
    } catch (error) {
        logger.error(`ERROR :: REFRESH USER`, {
            error: serializeError(error),
            body: req.body,
            token: req.cookies[refreshTokenName],
        });
        const accessCookie = buildCookie(authTokenName, null, -1);
        const refreshCookie = buildCookie(refreshTokenName, null, -1);
        const cookies = [accessCookie, refreshCookie];
        res.setHeader("Set-Cookie", cookies);
        return res.status(400).json({ ok: false });
    }
});

module.exports = { router };
