const { Op } = require("sequelize");
const { models } = require("../services/db/definitions/db.init");
const NotificationTypes = require("../../src/v2/enum/notifications.js").NotificationTypes;

// @TODO
// 1. Zwracac TYLKO dane, ktore sa dla notification potrzebne - reszte usunac
// 2. Zaimplementowac filtry https://github.com/SublimeVentures/portal/commits/feature/vault-timeline-enhancement

// typeId
// onchain.createdAt
// onchain.txID
// onchain.chainId

// portal/src/v2/helpers/notifications.js
// TimelineItemDescription Component - Uzywa takich kluczy jak:
// src={`${cdn}/research/${slug}/icon.jpg`}
// const values = { value: '2', amount: '20', otcDeal: { amount: '20', price: 20 }, claim: { isClaimed: true }, payout: { totalAmount: '200', currencySymbol: 'GMRX' } }

// --- --- --- --- --- --- --- --- --- --- --- ---

/**
 * @typedef {Record<string, string | number>} NotificationFilters
 * @property {string} [offerId] Offer ID retrieved from querystring
 * @property {string | number} [type] Notification type (name or ID)
 * @property {Date|number} [before] Max. date of notification
 * @property {Date|number} [after] Min. date of notification
 * @property {number} [page=1] Page from which you're starting
 * @property {number} [size=8] Page size
 */

const BASE_INCLUDES = [
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
                model: models.network,
                foreignKey: "chainId",
            },
        ],
    },
];

/**
 * @param {Record<string, any> & { id: number }} user
 * @param {NotificationFilters} filters
 * @returns {Promise<import("sequelize").Model[]>}
 */
async function getNotifications(user, filters) {
    const { userId, tenantId } = user;
    const size = filters.size ?? 8;
    const page = filters.page ?? 1;
    const offset = (page === 1 ? page : page - 1) * size;
    const filterConfig = { userId, limit: size ?? 8, offset };

    if (tenantId) filterConfig["tenantId"] = { [Op.or]: [tenantId, 0, null] };
    if (filters.offerId) filterConfig["offerId"] = Number.parseInt(filters.offerId);
    if (filters.type) {
        filterConfig["typeId"] = typeof filters.type === "number" ? filters.type : notificationTypeToId(filters.type);
    }
    if (filters.before && filters.after) {
        filterConfig["created_at"] = { [Op.between]: [new Date(filters.after), new Date(filters.before)] };
    } else if (filters.before) {
        filterConfig["created_at"] = { [Op.lte]: new Date(filters.before) };
    } else if (filters.after) {
        filterConfig["created_at"] = { [Op.gte]: new Date(filters.after) };
    }

    return getAllNotifications(filterConfig);
}

/**
 * @param {string} typeName
 * @return {Promise<void>}
 */
async function notificationTypeToId(typeName) {
    const key = typeName.toUpperCase();
    return NotificationTypes[key];
}

/**
 * @param {import("sequelize").Model<{ id: number; data: any }>} notification
 * @return {Promise<import("sequelize").Model>}
 */
async function getNotificationByStrategy(notification) {
    const { typeId } = notification;
    switch (/** @type {NotificationType[keyof NotificationType]} */ typeId) {
        case NotificationTypes.CLAIM:
            return getClaimNotification(notification);
        case NotificationTypes.INVESTMENT:
            return getInvestmentNotification(notification);
        case NotificationTypes.REFUND:
            return getRefundNotification(notification);
        case NotificationTypes.MYSTERY_BUY:
            return getMysteryBuyNotification(notification);
        case NotificationTypes.OTC_CANCEL:
            return getOtcNotification(notification);
        case NotificationTypes.OTC_MADE:
            return getOtcNotification(notification);
        case NotificationTypes.OTC_TAKE:
            return getOtcNotification(notification);
        case NotificationTypes.UPGRADE_BUY:
            return getUpgradeBuyNotification(notification);
        default:
            return notification;
    }
}

/**
 * @return {import("sequelize").Model}
 */
async function getClaimNotification({ id, data }) {
    const { chainId, payoutId, claimId } = data;
    return models.notification.findByPk(id, {
        include: [
            {
                model: models.network,
                where: { id: chainId },
            },
            {
                model: models.payout,
                where: { id: payoutId },
            },
            {
                model: models.claim,
                where: { id: claimId },
            },
        ],
    });
}

/**
 * @return {import("sequelize").Model}
 */
async function getOtcNotification({ id, data }) {
    const { otcDealId } = data;
    return models.notification.findByPk(id, {
        include: [
            {
                model: models.otcDeal,
                where: { id: otcDealId },
            },
        ],
    });
}

/**
 * @type {Record<string, any>}
 * @return {import("sequelize").Model}
 */
async function getInvestmentNotification({ id, data }) {
    const { partnerId } = data;
    return models.notification.findByPk(id, {
        include: [
            {
                model: models.partner,
                where: { id: partnerId },
            },
        ],
    });
}

/**
 * @type {Record<string, any>}
 * @return {import("sequelize").Model}
 */
async function getRefundNotification({ id }) {
    return models.notification.findByPk(id);
}

/**
 * @type {Record<string, any>}
 * @return {import("sequelize").Model}
 */
async function getMysteryBuyNotification({ id }) {
    return models.notification.findByPk(id);
}

/**
 * @type {Record<string, any>}
 * @return {import("sequelize").Model}
 */
async function getUpgradeBuyNotification({ id }) {
    return models.notification.findByPk(id);
}

/**
 * @type {Promise<import("sequelize").Model[]>}
 */
async function getAllNotifications(filterConfig) {
    const { limit, offset, ...where } = filterConfig;
    const base = await models.notification.findAll({
        where,
        include: BASE_INCLUDES,
        limit,
        offset,
        order: [["id", "DESC"]],
    });
    const results = [];
    for (const notification of base) {
        results.push(getNotificationByStrategy(notification));
    }

    return results;
}

module.exports = {
    getNotifications,
};
