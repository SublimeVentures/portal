import OtcMessage from "@/v2/components/Timeline/OTCMessage";
import { NotificationTypes, NotificationTypeNames } from "@/v2/enum/notifications";
import { PremiumItemsENUM } from "@/lib/enum/store";
import { formatCurrency } from "@/v2/helpers/formatters";

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
            return `Purchased ${values.data.amount} mystery box${values.data.amount < 1 ? "es" : ""}`;
        case NotificationTypes.UPGRADE_BUY:
            return `Purchased ${values.data.amount} ${PremiumItemsENUM.Guaranteed === values?.upgrade?.storeId ? "Guaranteed" : "Increased"} Allocation${values.data.amount < 1 ? "s" : ""}`;
        case NotificationTypes.OTC_CANCEL:
            return <OtcMessage action="Cancel" values={values.otcDeal} />;
        case NotificationTypes.OTC_MADE:
            return <OtcMessage action="Made" values={values.otcDeal} />;
        case NotificationTypes.OTC_TAKE:
            return <OtcMessage action="Take" values={values.otcDeal} />;
        case NotificationTypes.INVESTMENT:
            return `${formatCurrency(values.data.amount)} in ${values?.offer?.name}`;
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

export function getImageSrc({ typeId, offer, upgrade }, { getResearchIconSrc, getStoreSrc }) {
    switch (typeId) {
        case NotificationTypes.MYSTERY_BUY:
            return "/img/mysterybox.webp";
        case NotificationTypes.UPGRADE_BUY:
            return getStoreSrc(upgrade?.img);
        default:
            return getResearchIconSrc(offer?.slug);
    }
}
