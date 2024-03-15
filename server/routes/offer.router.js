const express = require("express");
const router = express.Router();
const {
    getParamOfferDetails,
    getOfferAllocation,
} = require("../controllers/offerDetails");
const { getParamOfferList } = require("../controllers/offerList");
const { verifyID } = require("../../src/lib/authHelpers");
const { useUpgrade } = require("../controllers/upgrade");
const { userStatusInOffer } = require("../controllers/participants");

router.get("/", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getParamOfferList(user));
});

router.get("/:slug", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getParamOfferDetails(user, req));
});

router.get("/allocation/:id", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getOfferAllocation(req));
});

router.get("/:id/upgrade/:upgrade", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await useUpgrade(user, req));
});

router.get("/:id/state", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});
    return res.status(200).json(await userStatusInOffer(user, req));
});

module.exports = { router };
