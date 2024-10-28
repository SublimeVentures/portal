const express = require("express");
const router = express.Router();
const {
    claim,
    removeBooking,
    sign,
    getReservedMysteryBox,
    reserve,
} = require("../controllers/mysterybox");
const { verifyID } = require("../../src/lib/authHelpers");

router.get("/claim", async (req, res) => {
    const { user } = req;

    return res.status(200).json(await claim(user));
});

router.post("/reserve", async (req, res) => {
    if (!req.body?.chainId) return res.status(400).json({});

    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await reserve(req));
});

router.post("/reserved", async (req, res) => {
    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getReservedMysteryBox(req));
});

router.post("/remove-booking-mystery-box", async (req, res) => {
    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await removeBooking(req));
});


router.post("/sign", async (req, res) => {
    if (!req.body?.chainId) return res.status(400).json({});

    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await sign(req));
});

module.exports = { router };
