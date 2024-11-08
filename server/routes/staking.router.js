const express = require("express");
const router = express.Router();
const { stake } = require("../controllers/staking");
const { verifyID } = require("../../src/lib/authHelpers");

router.get("/", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await stake(user, req));
});

module.exports = { router };
