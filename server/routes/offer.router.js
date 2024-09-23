const express = require("express");
const router = express.Router();
const { getParamOfferDetails, getOfferAllocation } = require("../controllers/offerDetails");
const { getOffersStats, getParamOfferList } = require("../controllers/offerList");
const { verifyID } = require("../../src/lib/authHelpers");
const { useUpgrade } = require("../controllers/upgrade");
const { userStatusInOffer } = require("../controllers/participants");
const { getOfferProgress, getOfferParticipants, deleteOfferParticipants } = require("../queries/offers.query");

router.get("/", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getParamOfferList(user, req));
});

router.get("/stats", async (req, res) => {
    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getOffersStats());
});

router.get("/progress", async (req, res) => {
    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getOfferProgress(req.query.offerId));
});

router.get("/:slug", async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await getParamOfferDetails(user, request));
});

router.get("/allocation/:id", async (req, res) => {
    return res.status(200).json(await getOfferAllocation(req));
});

router.get("/:id/upgrade/:upgrade", async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await useUpgrade(user, request));
});

router.get("/:id/state", async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await userStatusInOffer(user, request));
});

router.get("/:id/participants", async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await getOfferParticipants(user, request));
});

router.delete("/:offerId/participants/:participantId", async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await deleteOfferParticipants(user, request));
});


module.exports = { router };
