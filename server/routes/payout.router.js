const express = require("express");
const router = express.Router();
const { verifyID } = require("../../src/lib/authHelpers");
const { userPayout, userPayouts } = require("../controllers/payout");

router.get("/", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return userPayouts(req, res, user);
});

router.get("/:id", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await userPayout(user, req));
});

module.exports = { router };
