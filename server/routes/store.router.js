const express = require("express");
const router = express.Router();
const { getStoreData } = require("../controllers/store");
const { getStoreItemsOwned } = require("../queries/storeUser.query");
const { reserveUpgrade, getReservedUpgrades, sign, removeUpgradeBooking } = require("../controllers/upgrade");
const { verifyID } = require("../../src/lib/authHelpers");

router.get("/owned", async (req, res) => {
    const { user } = req;
    return res.status(200).json(await getStoreItemsOwned(user.userId, user.tenantId));
});

router.get("/", async (req, res) => {
    const { user } = req;
    return res.status(200).json(await getStoreData(user));
});

router.post("/reserve", async (req, res) => {
    if (!req.body?.chainId) return res.status(400).json({});

    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await reserveUpgrade(req));
});

router.post("/reserved-upgrades", async (req, res) => {
    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getReservedUpgrades(req));
});

router.post("/remove-upgrade-booking", async (req, res) => {
    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await removeUpgradeBooking(req));
});


router.post("/sign", async (req, res) => {
    if (!req.body?.chainId) return res.status(400).json({});

    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await sign(req));
});

module.exports = { router };
