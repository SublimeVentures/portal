const { getNotifications } = require("../queries/notifications.query");

/**
 * @param {Record<string, any> & { id: number }} user
 * @param {import("express").Request} request
 * @returns {Promise<import("sequelize").Model[]>}
 */
async function getNotificationsByParams(user, request) {
    return getNotifications(user, { ...request.query });
}

module.exports = {
    getNotificationsByParams,
};
