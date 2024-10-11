const express = require("express");
const router = express.Router();
const { claim, reserveMysteryBox } = require("../controllers/mysterybox");
const { verifyID } = require("../../src/lib/authHelpers");

router.get("/claim", async (req, res) => {
    const { user } = req;

    return res.status(200).json(await claim(user));
});

router.post("/reserve", async (req, res) => {
    if (!req.body?.chainId) return res.status(400).json({});

    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await reserveMysteryBox(req));
});

module.exports = { router };
