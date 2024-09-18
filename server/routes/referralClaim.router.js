const express = require("express");
const router = express.Router();
const { signUserReferralClaim, userReferralClaim } = require("../controllers/referralClaim");
const checkTenant = require("../middlewares/checkTenant");

router.post("/sign", checkTenant, async (req, res) => {
    const { user } = req;
    return res.status(200).json(await signUserReferralClaim(user, req));
});

router.get("/:id", checkTenant, async (req, res) => {
    const { user } = req;
    return res.status(200).json(await userReferralClaim(user, req));
});

module.exports = { router };
