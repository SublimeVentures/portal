const express = require("express");
const router = express.Router();
const { getReferralCode, getReferrals, createReferral } = require("../controllers/referral");

router.get("/", async (req, res) => {
    return res.status(200).json(await getReferralCode(req));
});

router.get("/referrals", async (req, res) => {
    return res.status(200).json(await getReferrals(req));
});

router.post("/create", async (req, res) => {
    return res.status(200).json(await createReferral(req));
});

module.exports = { router };