const { getNotifications, NotificationTypes, getExtendedNotification } = require("../queries/notifications.query");
const { models } = require("../services/db/definitions/db.init");

/**
 * @param {Record<string, any> & { id: number }} user
 * @param {import("express").Request} request
 * @returns {Promise<import("sequelize").Model[]>}
 */
async function getNotificationsByParams(user, request) {
    return getNotifications(user, { ...request.query });
}

/**
 * @param {Record<string, any> & { id: number }} user
 * @param {number} id
 */
async function getNotificationData(user, id) {
    return getExtendedNotification(user, id);
}

module.exports = {
    getNotificationsByParams,
    getNotificationData,
};
