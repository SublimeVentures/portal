const express = require("express");
const router = express.Router();
const {
    getNotificationChannels,
    getNotificationPreferences,
    setNotificationPreferences,
} = require("../controllers/notifications");

router.get("/channels", async (req, res) => {
    return getNotificationChannels(req, res);
});

router.get("/preferences", async (req, res) => {
    return getNotificationPreferences(req, res);
});

router.post("/preferences", async (req, res) => {
    return setNotificationPreferences(req, res);
});

module.exports = { router };
