/**
 * @typedef {object} NotificationType
 * @property {3} OTC_CANCEL
 * @property {7} REFUND
 * @property {1} MYSTERY_BUY
 * @property {5} OTC_TAKE
 * @property {2} UPGRADE_BUY
 * @property {6} INVESTMENT
 * @property {4} OTC_MADE
 * @property {8} CLAIM
 * @property {[3, 4, 5]} OTCS
 */

/**
 * @description Notification types as a representation in code
 * @type {NotificationType}
 */
const NotificationTypes = {
    MYSTERY_BUY: 1,
    UPGRADE_BUY: 2,
    OTC_CANCEL: 3,
    OTC_MADE: 4,
    OTC_TAKE: 5,
    INVESTMENT: 6,
    REFUND: 7,
    CLAIM: 8,
    OTCS: [3, 4, 5],
};

/**
 * @description Notification type names as a representation in code
 * @type {object}
 */
const NotificationTypeNames = {
    [NotificationTypes.INVESTMENT]: "Invested",
    [NotificationTypes.CLAIM]: "Claimed",
    [NotificationTypes.REFUND]: "Refunded",
    [NotificationTypes.OTC_MADE]: "OTC Made",
    [NotificationTypes.OTC_TAKE]: "OTC Take",
    [NotificationTypes.OTC_CANCEL]: "OTC Cancelled",
    [NotificationTypes.MYSTERY_BUY]: "Mystery Box obtained",
    [NotificationTypes.UPGRADE_BUY]: "Acquired upgrade",
};

module.exports = {
    NotificationTypeNames,
    NotificationTypes,
};
