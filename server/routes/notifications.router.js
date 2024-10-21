const express = require("express");
const router = express.Router();

const { verifyID } = require("../../src/lib/authHelpers");
const { getNotifications } = require("../queries/notifications.query");

router.get("/", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getNotifications(user, { ...req.query }));
});

const notificationsController = require("../controllers/notifications");

router.get("/channels", notificationsController.getNotificationChannels);

router.get("/preferences", notificationsController.getNotificationPreferences);

router.post("/preferences", notificationsController.setNotificationPreferences);

router.post("/subscription", notificationsController.subscribeToTopic);

router.delete("/subscription", notificationsController.unsubscribeFromTopic);

module.exports = { router };
