const express = require("express");
const router = express.Router();
const { reserveSpot, reserveExpire, reserveExpireAll } = require("../controllers/invest");
const { verifyID } = require("../../src/lib/authHelpers");

router.get("/", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await reserveSpot(user, req));
});

module.exports = { router };
