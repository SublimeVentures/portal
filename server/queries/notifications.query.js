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

async function getNotificationPreferences(userId, tenantId) {
    const preferences = await models.notificationChannelPreference.findAll({
        where: { userId, tenantId },
    });
    return preferences.reduce((acc, pref) => {
        if (!acc[pref.channelCategoryId]) {
            acc[pref.channelCategoryId] = {};
        }
        acc[pref.channelCategoryId][pref.channelId] = true;
        return acc;
    }, {});
}

async function setNotificationPreferences(userId, tenantId, updates) {
    return Promise.all(
        updates.map((update) => {
            if (update.enabled) {
                return models.notificationChannelPreference.findOrCreate({
                    where: {
                        userId,
                        tenantId,
                        channelId: update.channelId,
                        channelCategoryId: update.categoryId,
                    },
                });
            } else {
                return models.notificationChannelPreference.destroy({
                    where: {
                        userId,
                        tenantId,
                        channelId: update.channelId,
                        channelCategoryId: update.categoryId,
                    },
                });
            }
        }),
    );
}

module.exports = {
    getNotificationChannels,
    getNotificationPreferences,
    setNotificationPreferences,
};
