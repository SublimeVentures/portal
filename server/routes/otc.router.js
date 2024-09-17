const express = require("express");
const router = express.Router();
const {
    getMarkets,
    getUserAllocation,
    getOffers,
    getHistory,
    getLatestDeals,
    createOffer,
    signOffer,
} = require("../controllers/otc");

router.get("/markets", async (req, res) => {
    const { user } = req;

    return res.status(200).json(await getMarkets(user));
});

router.get("/allocation", async (req, res) => {
    const { user } = req;

    return res.status(200).json(await getUserAllocation(user));
});

router.get("/offers/:id", async (req, res) => {
    return res.status(200).json(await getOffers(req));
});

router.get("/history/:id", async (req, res) => {
    return res.status(200).json(await getHistory(req));
});

router.get("/latest", async (req, res) => {
    return res.status(200).json(await getLatestDeals(req));
});

router.post("/:id/create", async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await createOffer(user, request));
});

router.post("/:id/sign", async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await signOffer(user, request));
});

module.exports = { router };
