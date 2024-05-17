const express = require("express");
const router = express.Router();
const { verifyID } = require("../../src/lib/authHelpers");
const { getReferralCode, getReferrals, createReferral } = require("../controllers/referral");
const { tenantIndex } = require("../../src/lib/utils");
const { TENANT } = require("../../src/lib/tenantHelper");

const isBaseVCTenant = tenantIndex === TENANT.basedVC;

router.get("/", async (req, res) => {
    if (isBaseVCTenant) {
        const { auth, user } = await verifyID(req);
        if (!auth) return res.status(401).json({});

        return res.status(200).json(await getReferralCode(user, req));
    } else {
        return res.status(403).json({ error: "Not allowed on current tenant" });
    }
});

router.get("/referrals", async (req, res) => {
    if (isBaseVCTenant) {
        const { auth, user } = await verifyID(req);
        if (!auth) return res.status(401).json({});

        return res.status(200).json(await getReferrals(user, req));
    } else {
        return res.status(403).json({ error: "Not allowed on current tenant" });
    }
});

router.post("/create", async (req, res) => {
    if (isBaseVCTenant) {
        const { auth, user } = await verifyID(req);
        if (!auth) return res.status(401).json({});

        return res.status(200).json(await createReferral(user, req));
    } else {
        return res.status(403).json({ error: "Not allowed on current tenant" });
    }
});

module.exports = { router };
