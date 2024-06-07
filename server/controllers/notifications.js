const { getNotifications, getExtendedNotification } = require("../queries/notifications.query");

/**
 * @param {Record<string, any> & { id: number }} user
 * @param {import("express").Request} request
 * @returns {Promise<import("sequelize").Model[]>}
 */
async function getNotificationsByParams(user, request) {
    return getNotifications(user, { ...request.query });
}

/**
 * @param {number} id
 */
async function getNotificationData(id) {
    return getExtendedNotification(id);
}

module.exports = {
    getNotificationsByParams,
    getNotificationData,
};
