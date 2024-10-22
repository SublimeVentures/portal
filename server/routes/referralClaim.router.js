const express = require("express");
const router = express.Router();
const { signUserReferralClaim, userReferralClaim } = require("../controllers/referralClaim");

router.post("/sign", async (req, res) => {
    const { user } = req;
    return res.status(200).json(await signUserReferralClaim(user, req));
});

router.get("/", async (req, res) => {
    const { user } = req;
    return res.status(200).json(await userReferralClaim(user, req));
});

module.exports = { router };
