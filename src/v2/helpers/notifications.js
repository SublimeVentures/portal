import OtcMessage from "@/v2/components/Timeline/OTCMessage";
import { NotificationTypes, NotificationTypeNames } from "@/v2/enum/notifications";

/**
 * @description Get the notification title based on the type
 * @param {import("server/enum/NotificationTypes").NotificationTypes[keyof import("server/enum/NotificationTypes").NotificationTypes]} type
 * @returns {string} - The notification title
 */
export function getNotificationTitle(type) {
    return NotificationTypeNames[type] || "UNKNOWN NOTIFICATION";
}

export function getDescriptionMessage(type, values) {
    switch (type) {
        case NotificationTypes.MYSTERY_BUY:
            return null;
        case NotificationTypes.UPGRADE_BUY:
            return "Increased Allocation";
        case NotificationTypes.OTC_CANCEL:
            return <OtcMessage action="Cancel" values={values.otcDeal} />;
        case NotificationTypes.OTC_MADE:
            return <OtcMessage action="Made" values={values.otcDeal} />;
        case NotificationTypes.OTC_TAKE:
            return <OtcMessage action="Take" values={values.otcDeal} />;
        case NotificationTypes.INVESTMENT:
            return `Invested $${values.data.value}`;
        case NotificationTypes.REFUND:
            return `Issued refund for $${values.data.amount}`;
        case NotificationTypes.CLAIM:
            return `
                ${values.claim?.isClaimed ? "Claimed" : "Not claimed"}
                with total amount of
                ${parseFloat(values.payout?.totalAmount).toFixed(2)} ${values.payout?.currencySymbol}
            `;
        default:
            return null;
    }
}

export function getRedirectMessage(type, values) {
    switch (type) {
        case NotificationTypes.MYSTERY_BUY:
        case NotificationTypes.UPGRADE_BUY:
            return null;
        case NotificationTypes.OTC_CANCEL:
        case NotificationTypes.OTC_MADE:
        case NotificationTypes.OTC_TAKE:
            return "See on Block Explorer";
        case NotificationTypes.INVESTMENT:
        case NotificationTypes.REFUND:
            return null;
        case NotificationTypes.CLAIM:
            return `Claimed ${values.offerPayout} payout on ${values.currencySymbol} chain`;
        default:
            return null;
    }
}
