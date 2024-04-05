const { Op, Sequelize } = require("sequelize");
const { models } = require("../services/db/definitions/db.init");

/**
 * @typedef {Object} NotificationFilters
 * @property {string | undefined} offerId Offer ID retrieved from querystring
 * @property {string | number | undefined} type Notification type (name or ID)
 */

/**
 * @param {Record<string, any> & { id: number }} user
 * @param {NotificationFilters} filters
 * @returns {Promise<import("sequelize").Model[]>}
 */
async function getNotifications(user, filters) {
    const { userId, tenantId } = user;
    const filterConfig = { userId };
    if (tenantId) filterConfig["tenantId"] = { [Op.or]: [tenantId, null] };
    if (filters.type) filterConfig["typeId"] = await getNotificationTypeId(filters.type);
    if (filters.offerId) filterConfig["offerId"] = Number.parseInt(filters.offerId);
    console.log(filterConfig);
    return await models.notification.findAll({
        where: filterConfig,
        include: [
            {
                model: models.notificationType,
                attributes: ["name"],
            },
            {
                model: models.onchain,
                include: [
                    {
                        model: models.onchainType,
                        attributes: ["name"],
                    },
                ],
            },
        ],
    });
}

/**
 * @param {string | number | undefined} notificationType
 * @returns {Promise<number>}
 */
async function getNotificationTypeId(notificationType) {
    if (typeof notificationType === "number") {
        return notificationType;
    }
    if (typeof notificationType === "string") {
        const nType = await models.notificationType.findOne({
            type: notificationType,
        });
        return nType.id;
    }
}

module.exports = {
    getNotifications,
};
