const express = require("express");
const router = express.Router();
const { getMarkets, getUserAlocation, getOffers, getHistory, getLatestDeals, createOffer, signOffer } = require("../controllers/otc");
const { verifyID } = require("../../src/lib/authHelpers");

router.get("/markets", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});
    return res.status(200).json(await getMarkets(user));
});

router.get("/allocation", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});
    
    return res.status(200).json(await getUserAlocation(user));
});

router.get("/offers/:id", async (req, res) => {
    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getOffers(req));
});

router.get("/history/:id", async (req, res) => {
    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getHistory(req));
});

router.get("/latest", async (req, res) => {
    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getLatestDeals(req));
});

router.post("/:id/create", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await createOffer(user, req));
});

router.post("/:id/sign", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await signOffer(user, req));
});

module.exports = { router };
