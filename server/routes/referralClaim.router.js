const express = require("express");
const router = express.Router();
const { verifyID } = require("../../src/lib/authHelpers");
const { signUserReferralClaim, userReferralClaim } = require("../controllers/referralClaim");
const { tenantIndex } = require("../../src/lib/utils");
const { TENANT } = require("../../src/lib/tenantHelper");

const isBaseVCTenant = tenantIndex === TENANT.basedVC;

router.post("/sign", async (req, res) => {
    if (isBaseVCTenant) {
        const { auth, user } = await verifyID(req);
        if (!auth) return res.status(401).json({});

        return res.status(200).json(await signUserReferralClaim(user, req));
    } else {
        return res.status(403).json({ error: "Not allowed on current tenant" });
    }
});

router.get("/:id", async (req, res) => {
    if (isBaseVCTenant) {
        const { auth, user } = await verifyID(req);
        if (!auth) return res.status(401).json({});

        return res.status(200).json(await userReferralClaim(user, req));
    } else {
        return res.status(403).json({ error: "Not allowed on current tenant" });
    }
});

module.exports = { router };
