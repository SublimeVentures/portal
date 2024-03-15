const express = require("express");
const router = express.Router();
const {
    refreshTokenName,
    authTokenName,
} = require("../../src/lib/authHelpers");
const axios = require("axios");
const logger = require("../../src/lib/logger");
const { serializeError } = require("serialize-error");
const { envCache } = require("../controllers/envionment");
const {
    verifyID,
    buildCookie,
    refreshTokens,
} = require("../../src/lib/authHelpers");

//LOGIN USER
router.post("/login", async (req, res) => {
    if (
        !req.body?.message ||
        !req.body?.signature ||
        !req.body?.tenant ||
        !req.body?.partner
    )
        return res.status(400).json({});
    try {
        const auth = await axios.post(
            `${process.env.AUTHER}/auth/login`,
            req.body,
            {
                headers: {
                    "content-type": "application/json",
                },
            },
        );
        const result = auth.data;
        if (!result?.ok) throw Error(result?.error);

        envCache.set(`${req.body.tenant}:${req.body.partner}`, result.env);

        const cookies = [
            result.cookie.refreshCookie,
            result.cookie.accessCookie,
        ];
        res.setHeader("Set-Cookie", cookies);
        delete result.cookie;
        delete result.token;
        delete result.env;
        return res.status(200).json(result);
    } catch (error) {
        logger.info(`LOGIN USER`, {
            error: serializeError(error),
            body: req.body,
        });
        return res.status(400).json({});
    }
});

//LOG OUT
router.delete("/login", async (req, res) => {
    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    try {
        const token = req.cookies[authTokenName];
        const auth = await axios.delete(`${process.env.AUTHER}/auth/login`, {
            data: { token },
        });
        const result = auth.data;
        if (!result?.ok) throw Error("Bad AUTHER response");
        const cookies = [
            result.cookie.refreshCookie,
            result.cookie.accessCookie,
        ];
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
        const cookie = [accessCookie, refreshCookie];
        res.setHeader("Set-Cookie", cookie);
        return res.status(400).json({ ok: false });
    }
});

//REFRESH TOKEN
router.put("/login", async (req, res) => {
    try {
        const token = req.cookies[refreshTokenName];
        console.log("refresh", token);
        const refresh = await refreshTokens(token);

        if (!refresh?.ok) throw Error("Bad AUTHER response");

        const cookies = [
            refresh.cookie.refreshCookie,
            refresh.cookie.accessCookie,
        ];
        res.setHeader("Set-Cookie", cookies);
        delete refresh.data.user;
        delete refresh.token;

        return res.status(200).json(refresh.data);
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
