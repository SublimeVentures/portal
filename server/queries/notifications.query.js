const { models } = require("../services/db/definitions/db.init");
const logger = require("../services/logger");

async function getNotificationChannels() {
    try {
        const [channels, categories] = await Promise.all([
            models.notificationChannel.findAll({
                where: {
                    enabled: true,
                },
                raw: true,
            }),
            models.notificationChannelCategory.findAll({ raw: true }),
        ]);
        return {
            channels,
            categories,
        };
    } catch (err) {
        return {
            channels: [],
            categories: [],
        };
    }
}

async function getNotificationPreferences(userId, tenantId) {
    try {
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
    } catch (err) {
        logger.error(err.message);
        return {};
    }
}

async function setNotificationPreferences(userId, tenantId, updates) {
    try {
        const updatables = updates.reduce(
            (acc, update) => {
                const { enabled, channelId, categoryId: channelCategoryId } = update;
                const targetArray = enabled ? acc.toInsert : acc.toDelete;
                targetArray.push({
                    userId,
                    tenantId,
                    channelId,
                    channelCategoryId,
                });
                return acc;
            },
            { toInsert: [], toDelete: [] },
        );

        return Promise.all(
            models.notificationChannelPreference.bulkCreate(updatables.toInsert, {
                ignoreDuplicates: true,
            }),
            models.notificationChannelPreference.destroy({
                where: {
                    $or: updatables.toDelete,
                },
            }),
        );
    } catch (err) {
        logger.error(err.message);
        return [];
    }
}

module.exports = {
    getNotificationChannels,
    getNotificationPreferences,
    setNotificationPreferences,
};
