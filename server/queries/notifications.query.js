const { Op } = require("sequelize");
const { models } = require("../services/db/definitions/db.init");
const { NotificationTypes } = require("../enum/NotificationTypes");

/**
 * @typedef {Record<string, string | number>} NotificationFilters
 * @property {string} [offerId] Offer ID retrieved from querystring
 * @property {string | number} [type] Notification type (name or ID)
 * @property {number} [lastId] Last notification ID (for pagination)
 * @property {"timeline" | "full"} [profile] Filter profile (all items or timeline-specific)
 * @property {number} [page=1] Page from which you're starting
 */

/**
 * @typedef {object} ClaimNotificationData
 * @property {number} claimId
 * @property {number} payoutId
 * @property {number} offerPayout
 * @property {number} amount
 * @property {string} currency
 * @property {number} chainId
 * @property {string} currencySymbol
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
    const filterConfig = { userId };
    if (tenantId) filterConfig["tenantId"] = { [Op.or]: [tenantId, 0, null] };
    if (filters.type) filterConfig["typeId"] = await getNotificationTypeId(filters.type);
    if (filters.offerId) filterConfig["offerId"] = Number.parseInt(filters.offerId);
    if (filters.lastId) filterConfig["id"] = { [Op.lt]: filters.lastId };
    const profileFilters = await getFiltersFromProfile(filters.profile);
    const config = { ...filterConfig, ...profileFilters };
    return getAllNotifications(config);
}

async function getExtendedNotification(notificationId) {
    return getNotificationByStrategy(notificationId);
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
 * @return {Promise<ReturnType<typeof getExtendedNotification>>}
 */
async function getNotificationByStrategy(notificationId) {
    const notification = await getBaseNotification(notificationId);
    const { typeId, data } = notification;
    switch (/** @type {NotificationType[keyof NotificationType]} */ typeId) {
        case NotificationTypes.CLAIM:
            return { notification, ...(await getClaimNotification(data)) };
        case NotificationTypes.INVESTMENT:
            return { notification, ...(await getInvestmentNotification(data)) };
        case NotificationTypes.REFUND:
            return { notification, ...(await getRefundNotification(data)) };
        case NotificationTypes.MYSTERY_BUY:
            return { notification, ...(await getMysteryBuyNotification(data)) };
        case NotificationTypes.OTC_CANCEL:
            return { notification, ...(await getOtcNotification(data)) };
        case NotificationTypes.OTC_MADE:
            return { notification, ...(await getOtcNotification(data)) };
        case NotificationTypes.OTC_TAKE:
            return { notification, ...(await getOtcNotification(data)) };
        case NotificationTypes.UPGRADE_BUY:
            return { notification, ...(await getUpgradeBuyNotification(data)) };
        default:
            return { notification };
    }
}

/**
 * @param {Record<string, any> | number} filterConfig Filters configuration or notification ID
 * @return {Promise<Model | null>}
 */
async function getBaseNotification(filterConfig) {
    const id = Number(filterConfig);
    if (Number.isNaN(id)) {
        return models.notification.findOne({
            where: filterConfig,
            include: BASE_INCLUDES,
            plain: true,
        });
    }

    return models.notification.findByPk(`${filterConfig}`, {
        include: BASE_INCLUDES,
        plain: true,
    });
}

/**
 * @param {{
 *     amount: number;
 *     claimId: number;
 *     payoutId: number;
 *     offerPayout: number;
 *     amount: number;
 *     currency: string;
 *     chainId: number;
 *     currencySymbol: string;
 * }} data
 * @return {Record<string, any> & data}
 */
async function getClaimNotification(data) {
    const { chainId, payoutId, claimId, ...contents } = data;
    const network = await models.network.findByPk(chainId, { plain: true });
    const payout = await models.payout.findByPk(payoutId, { plain: true });
    const claim = await models.claim.findByPk(claimId, { plain: true });

    return {
        ...contents,
        network,
        payout,
        claim,
    };
}

/**
 * @param {{
 *     otcId: number;
 *     dealId: number;
 *     otcDealId: number;
 *     price: number;
 *     amount: number;
 *     currency: string;
 *     isSell: boolean;
 *     tenantId: number
 * }} data
 * @return {Record<string, any> & data}
 */
async function getOtcNotification(data) {
    const { otcDealId, ...contents } = data;
    const otcDeal = await models.otcDeal.findByPk(otcDealId, { plain: true });

    return { ...contents, otcDeal };
}

/**
 * @type {Record<string, any>}
 * @param {{ amount: number; partnerId: number }} data
 * @return {Record<string, any> & data}
 */
async function getInvestmentNotification(data) {
    const { partnerId, ...contents } = data;
    const partner = await models.partner.findByPk(partnerId, { plain: true });

    return { ...contents, partner };
}

/**
 * @type {Record<string, any>}
 */
async function getRefundNotification(data) {
    return { ...data };
}

/**
 * @type {Record<string, any>}
 * @param {{ amount: number; item: number }} data
 */
async function getMysteryBuyNotification(data) {
    return { ...data };
}

/**
 * @type {Record<string, any>}
 * @param {{ amount: number; item: number }} data
 */
async function getUpgradeBuyNotification(data) {
    return { ...data };
}

/**
 * @type {Promise<import("sequelize").Model[]>}
 */
async function getAllNotifications(filterConfig) {
    const { limit, ...where } = filterConfig;
    return await models.notification.findAll({
        where,
        include: BASE_INCLUDES,
        limit: limit,
        order: [["id", "DESC"]],
    });
}

module.exports = {
    NotificationTypes,
    getNotifications,
    getExtendedNotification,
};
