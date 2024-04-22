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
};

module.exports = { NotificationTypes };
