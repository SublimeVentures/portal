const { Op } = require("sequelize");
const { models } = require("../services/db/definitions/db.init");
const { NotificationTypes } = require("../enum/NotificationTypes");

/**
 * @typedef {Record<string, string | number>} NotificationFilters
 * @property {string} [offerId] Offer ID retrieved from querystring
 * @property {string | number} [type] Notification type (name or ID)
 * @property {number} [lastId] Last notification ID (for pagination)
 * @property {"timeline" | "full"} [profile] Filter profile (all items or timeline-specific)
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
    if (filters.lastId) filterConfig["id"] = { $gt: filters.lastId };
    const profileFilters = await getFiltersFromProfile(filters.profile);
    const config = { ...filterConfig, ...profileFilters };
    return getAllNotifications(config);
}

async function getExtendedNotification(user, notificationId) {
    const { userId, tenant } = user;
    const config = { userId, tenant };
    return getNotificationByStrategy(notificationId, config);
}

/**
 * @private
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

/**
 * @private
 * @param {NotificationFilters["profile"]} profile
 * @returns {Promise<Record<string, string | string[]>>}
 */
async function getFiltersFromProfile(profile) {
    const notificationTypes = await models.notificationType.findAll({
        attributes: ["id", "name"],
    });
    switch (profile) {
        case "timeline":
            return {
                typeId: notificationTypes.filter(timelineFilter).map(mapNotificationTypeToId),
            };
        case "full":
        default:
            return {};
    }
}

/**
 * @private
 * @param {import("sequelize").Model} notificationType
 * @returns {boolean}
 */
function timelineFilter(notificationType) {
    return ["OTC_TAKE", "OTC_MADE", "OTC_CANCEL", "INVESTMENT", "CLAIM"].includes(notificationType.name);
}

/**
 * @param {import("sequelize").Model} notificationType
 * @returns {number}
 */
function mapNotificationTypeToId(notificationType) {
    return notificationType.id;
}

/**
 * @param {number} notificationId
 * @param {Record<string, string | number>} filterConfig
 * @return {Promise<ReturnType<typeof getExtendedNotification>>}
 */
async function getNotificationByStrategy(notificationId, filterConfig) {
    const notification = await models.notification.findByPk(notificationId);
    const { typeId } = notification;
    switch (/** @type {NotificationType[keyof NotificationType]} */ typeId) {
        case NotificationTypes.CLAIM:
            return getClaimNotification(filterConfig);
        case NotificationTypes.INVESTMENT:
            return getInvestmentNotification(filterConfig);
        case NotificationTypes.REFUND:
            return getRefundNotification(filterConfig);
        case NotificationTypes.MYSTERY_BUY:
            return getMysteryBuyNotification(filterConfig);
        case NotificationTypes.OTC_CANCEL:
            return getOtcCancelNotification(filterConfig);
        case NotificationTypes.OTC_MADE:
            return getOtcMadeNotification(filterConfig);
        case NotificationTypes.OTC_TAKE:
            return getOtcTakeNotification(filterConfig);
        case NotificationTypes.UPGRADE_BUY:
            return getUpgradeBuyNotification(filterConfig);
        default:
            return {};
    }
}

/**
 * @type {Promise<import("sequelize").Model>}
 */
async function getClaimNotification(filterConfig) {
    return await models.notification.findOne({
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
                    {
                        model: models.payout,
                        include: [
                            {
                                model: models.payout,
                            },
                        ],
                    },
                ],
            },
        ],
    });
}

/**
 * @type {Promise<import("sequelize").Model>}
 */
async function getOtcTakeNotification(filterConfig) {}

/**
 * @type {Promise<import("sequelize").Model>}
 */
async function getOtcMadeNotification(filterConfig) {}

/**
 * @type {Promise<import("sequelize").Model>}
 */
async function getOtcCancelNotification(filterConfig) {}

/**
 * @type {Promise<import("sequelize").Model>}
 */
async function getInvestmentNotification(filterConfig) {}

/**
 * @type {Promise<import("sequelize").Model>}
 */
async function getRefundNotification(filterConfig) {}

/**
 * @type {Promise<import("sequelize").Model>}
 */
async function getMysteryBuyNotification(filterConfig) {}

/**
 * @type {Promise<import("sequelize").Model>}
 */
async function getUpgradeBuyNotification(filterConfig) {}

/**
 * @type {Promise<import("sequelize").Model[]>}
 */
async function getAllNotifications(filterConfig) {
    const { limit, ...where } = filterConfig;
    return await models.notification.findAll({
        where,
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
        limit: limit ?? 8,
        order: "id",
    });
}

module.exports = {
    NotificationTypes,
    getNotifications,
    getExtendedNotification,
};
