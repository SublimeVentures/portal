const express = require("express");
const router = express.Router();
const { getNotificationChannels } = require("../controllers/notifications");

router.post("/channels", async (req, res) => {
    return res.status(200).json(await getNotificationChannels());
});

module.exports = { router };
