const express = require("express");
const router = express.Router();
const { verifyID } = require("../../src/lib/authHelpers");
const { getReferrals } = require("../controllers/referals");

router.get("/", async (req, res) => {
    const data = await verifyID(req);
    const { auth, user } = data;
    if (!auth) return res.status(401).json({});
    return getReferrals(req, res, user);
});

module.exports = { router };
