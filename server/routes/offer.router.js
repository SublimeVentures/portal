const express = require("express");
const router = express.Router();
const { getParamOfferDetails, getOfferAllocation } = require("../controllers/offerDetails");
const { getParamOfferList } = require("../controllers/offerList");
const { verifyID } = require("../../src/lib/authHelpers");
const { useUpgrade } = require("../controllers/upgrade");
const { userStatusInOffer } = require("../controllers/participants");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getParamOfferList(user, req));
});

router.get("/:slug", authMiddleware, async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await getParamOfferDetails(user, request));
});

router.get("/allocation/:id", authMiddleware, async (req, res) => {
    return res.status(200).json(await getOfferAllocation(req));
});

router.get("/:id/upgrade/:upgrade", authMiddleware, async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await useUpgrade(user, request));
});

router.get("/:id/state", authMiddleware, async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await userStatusInOffer(user, request));
});

module.exports = { router };
