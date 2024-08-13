const { Op } = require("sequelize");
const { models } = require("../services/db/definitions/db.init");

async function getNotificationChannels() {
    try {
        const channels = await models.notificationChannel.findAll({
            where: {
                enabled: true,
            },
            raw: true,
        });
        const categories = await models.notificationChannelCategory.findAll({ raw: true });
        return {
            channels,
            categories,
        };
    } catch (err) {
        console.error(err);
        return {
            channels: [],
            categories: [],
        };
    }
}

module.exports = { getNotificationChannels };
