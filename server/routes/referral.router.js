const express = require("express");
const router = express.Router();
const { getReferralCode, getReferrals, createReferral } = require("../controllers/referral");
const checkTenant = require("../middlewares/checkTenant");

router.get("/", checkTenant, async (req, res) => {
    return res.status(200).json(await getReferralCode(req));
});

router.get("/referrals", checkTenant, async (req, res) => {
    return res.status(200).json(await getReferrals(req));
});

router.post("/create", checkTenant, async (req, res) => {
    return res.status(200).json(await createReferral(req));
});

module.exports = { router };
