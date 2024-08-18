const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notifications");

router.get("/channels", notificationsController.getNotificationChannels);

router.get("/preferences", notificationsController.getNotificationPreferences);

router.post("/preferences", notificationsController.setNotificationPreferences);

router.post("/subscription", notificationsController.subscribeToTopic);

router.delete("/subscription", notificationsController.unsubscribeFromTopic);

module.exports = { router };
