const { models } = require("../services/db/definitions/db.init");

async function getNotificationChannels() {
    return models.notificationChannel.findAll({ raw: true });
}

module.exports = { getNotificationChannels };
