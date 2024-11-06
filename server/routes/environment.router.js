const express = require("express");
const router = express.Router();
const { serializeError } = require("serialize-error");
const axios = require("axios");
const logger = require("../../src/lib/logger");
const { envCache } = require("../controllers/envionment");
const { buildCookie, authTokenName, refreshTokenName } = require("../../src/lib/authHelpers");

async function refreshPartnerEnvironment(user) {
    try {
        const environment = await axios.post(
            `${process.env.AUTHER}/environment/partner_refresh`,
            { partnerId: user.partnerId, tenantId: user.tenantId },
            {
                headers: {
                    "content-type": "application/json",
                },
            },
        );
        return environment.data;
    } catch (error) {
        logger.error(`ERROR :: GET ENV DATA`, { error: serializeError(error) });
        return { ok: false };
    }
}

//GET USER ENVIRONMENT DATA
router.get("/", async (req, res) => {
    const { user } = req;

    try {
        const environment = envCache.get(`${user.tenantId}:${user.partnerId}`);

        // if (!environment?.otcFee) {
        //     return await refreshPartnerEnvironment(user, res);
        // }

        if (!environment) {
            const refetchedEnviroment = await refreshPartnerEnvironment(user);
            if (refetchedEnviroment?.ok) {
                return res.status(200).json({ ...refetchedEnviroment });
            }
            throw new Error("Losted env cache!");
        }

        return res.status(200).json({ ...environment });
    } catch (error) {
        logger.error(`ERROR :: GET ENV DATA`, { error: serializeError(error) });
        //todo: temporary added
        const accessCookie = buildCookie(authTokenName, null, -1);
        const refreshCookie = buildCookie(refreshTokenName, null, -1);
        const cookie = [accessCookie, refreshCookie];
        res.setHeader("Set-Cookie", cookie);
        return res.status(401).json({ ok: false });
    }
});

module.exports = { router };
