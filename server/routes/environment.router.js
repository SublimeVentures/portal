const express = require("express");
const router = express.Router();
const { serializeError } = require("serialize-error");
const logger = require("../../src/lib/logger");
const { envCache } = require("../controllers/envionment");
const { buildCookie, authTokenName, refreshTokenName } = require("../../src/lib/authHelpers");
const { axiosAutherPublic } = require("../services/request/axios");

//GET USER ENVIRONMENT DATA
router.get("/", async (req, res) => {
    const { user } = req;

    try {
        const environment = envCache.get(`${user.tenantId}:${user.partnerId}`);

        if (!environment?.otcFee) {
            return await refreshPartnerEnvironment(user, res);
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

async function refreshPartnerEnvironment(user, res) {
    try {
        const environment = await axiosAutherPublic.post("/environment/partner_refresh", {
            partnerId: user.partnerId,
            tenantId: user.tenantId,
        });
        const result = environment.data;
        if (!result?.ok) return res.status(401).json({ ...result });
        return res.status(200).json({ ...result });
    } catch (error) {
        logger.error(`ERROR :: GET ENV DATA`, { error: serializeError(error) });
        return res.status(401).json({ ok: false });
    }
}

module.exports = { router };
