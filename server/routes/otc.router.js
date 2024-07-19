const express = require("express");
const router = express.Router();
const { getMarkets, getOffers, getHistory, createOffer, signOffer } = require("../controllers/otc");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/markets", authMiddleware, async (req, res) => {
    const { user } = req;

    return res.status(200).json(await getMarkets(user));
});

router.get("/offers/:id", authMiddleware, async (req, res) => {
    return res.status(200).json(await getOffers(req));
});

router.get("/history/:id", authMiddleware, async (req, res) => {
    return res.status(200).json(await getHistory(req));
});

router.post("/:id/create", authMiddleware, async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await createOffer(user, request));
});

router.post("/:id/sign", authMiddleware, async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await signOffer(user, request));
});

module.exports = { router };
