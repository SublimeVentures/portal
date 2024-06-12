import Image from "next/image";

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
const icon = `https://cdn.basedvc.fund/research/blockgames/icon.jpg`

export function getDescriptionMessage(type) {
    const values = { value: '2', amount: '20', otcDeal: { amount: '20', price: 20 }, claim: { isClaimed: true }, payout: { totalAmount: '200', currencySymbol: 'GMRX' } }
    
    switch (type) {
        case NotificationTypes.INVESTMENT:
            return `Invested $${values.value}`;
        case NotificationTypes.CLAIM:
            return `${values.claim?.isClaimed ? "Claimed" : "Not claimed"} with total amount of ${parseFloat(values.payout?.totalAmount).toFixed(2)} ${values.payout?.currencySymbol}`;
        case NotificationTypes.REFUND:
            return `Issued refund for: ${values.amount}`
        case NotificationTypes.OTC_MADE:
            return (
                <>
                    Made {values.otcDeal?.amount} {values.payout?.currencySymbol} 
                    <span className="rounded-lg">
                        <Image
                            src={icon}
                            className="inline mx-2 rounded-full"
                            alt=""
                            width={25}
                            height={25}
                        />
                    </span> 
                    units at ${values.otcDeal?.price.toFixed(2)} each.
                </>
            );
        case NotificationTypes.OTC_TAKE:
            return (
                <>
                    Taken {values.otcDeal?.amount} {values.payout?.currencySymbol} 
                    <span className="rounded-lg">
                        <Image
                            src={icon}
                            className="inline mx-2 rounded-full"
                            alt=""
                            width={25}
                            height={25}
                        />
                    </span> 
                    units at ${values.otcDeal?.price.toFixed(2)} each.
                </>
            );
        case NotificationTypes.OTC_CANCEL:
            return (
                <>
                    Cancelled {values.otcDeal?.amount} {values.payout?.currencySymbol} 
                    <span className="rounded-lg">
                        <Image
                            src={icon}
                            className="inline mx-2 rounded-full"
                            alt=""
                            width={25}
                            height={25}
                        />
                    </span> 
                    units at ${values.otcDeal?.price.toFixed(2)} each.
                </>
            );
        case NotificationTypes.UPGRADE_BUY:
            return "Increased Allocation";
        case NotificationTypes.MYSTERY_BUY:
        default:
            return null;
    }
}

export function getRedirectMessage(type) {
    const values = { value: '2', amount: '20', otcDeal: { amount: '20', price: 20 }, claim: { isClaimed: true }, payout: { totalAmount: '200', currencySymbol: 'GMRX' }, payoutCount: '2nd' }
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