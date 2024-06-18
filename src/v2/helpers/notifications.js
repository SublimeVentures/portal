import OtcMessage from "@/v2/components/Timeline/OTCMessage";
import { NotificationTypes, NotificationTypeNames } from "@/v2/enum/notifications"

/**
 * @description Get the notification title based on the type
 * @param {import("server/enum/NotificationTypes").NotificationTypes[keyof import("server/enum/NotificationTypes").NotificationTypes]} type
 * @returns {string} - The notification title
 */
export function getNotificationTitle(type) {
    return NotificationTypeNames[type] || "UNKNOWN NOTIFICATION";
}

// Needs cdn and slug - src={`${cdn}/research/${slug}/icon.jpg`}
const values = { value: '2', amount: '20', otcDeal: { amount: '20', price: 20 }, claim: { isClaimed: true }, payout: { totalAmount: '200', currencySymbol: 'GMRX' } }

export function getDescriptionMessage(type) {    
    switch (type) {
        case NotificationTypes.INVESTMENT:
            return `Invested $${values.value}`;
        case NotificationTypes.CLAIM:
            return `${values.claim?.isClaimed ? "Claimed" : "Not claimed"} with total amount of ${parseFloat(values.payout?.totalAmount).toFixed(2)} ${values.payout?.currencySymbol}`;
        case NotificationTypes.REFUND:
            return `Issued refund for: ${values.amount}`
        case NotificationTypes.OTC_MADE:
            return <OtcMessage action="Made" values={values} />
        case NotificationTypes.OTC_TAKE:
            return <OtcMessage action="Take" values={values} />
        case NotificationTypes.OTC_CANCEL:
            return <OtcMessage action="Cancel" values={values} />
        case NotificationTypes.UPGRADE_BUY:
            return "Increased Allocation";
        case NotificationTypes.MYSTERY_BUY:
        default:
            return null;
    }
}

export function getRedirectMessage(type) {
    switch (type) {
        case NotificationTypes.CLAIM:
            return `Claimed ${values.payoutCount} payout on ${values.currencySymbol} chain`;
        case NotificationTypes.MYSTERY_BUY:
        case NotificationTypes.UPGRADE_BUY:
            return null;
        case NotificationTypes.INVESTMENT:
        case NotificationTypes.REFUND:
        case NotificationTypes.OTC_MADE:
        case NotificationTypes.OTC_TAKE:
        case NotificationTypes.OTC_CANCEL:
        default:
            return "See on Block Explorer";
      }
}
