const express = require("express");
const router = express.Router();
const { verifyID } = require("../../src/lib/authHelpers");
const { getNotificationsByParams, getNotificationData } = require("../controllers/notifications");

router.get("/", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getNotificationsByParams(user, req));
});

router.get("/extended/:id", async (req, res) => {
    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getNotificationData(req.params.id));
});

module.exports = { router };
