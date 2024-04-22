import Sentry from "@sentry/nextjs";

/**
 * @param {keyof NotificationType} notificationType
 * @param {Record<string, string | number>} data
 * @returns {{ title: string, subtitle: string }}
 */
function mapNotificationTypeToContents(notificationType, data = {}) {
    switch (notificationType) {
        case "OTC_TAKE":
            return {
                title: "OTC buy/sell taken",
                subtitle: replaceWithData(
                    "You successfully sold/bought ${amount} allocation in project {project}",
                    data,
                ),
            };
        case "OTC_MADE":
            return {
                title: "OTC buy/sell offer created",
                subtitle: replaceWithData("Sell/buy ${amount} amount for ${price}", data),
            };
        case "OTC_CANCEL":
            return {
                title: "OTC buy/sell offer cancelled",
                subtitle: replaceWithData("Sell/buy ${amount} amount for ${price}", data),
            };
        case "INVESTMENT":
            return {
                title: replaceWithData("Invested ${amount}", data),
                subtitle: "",
            };
        case "CLAIM":
            return {
                title: replaceWithData("{amount} {symbol} claimed", data),
                subtitle: replaceWithData("Claimed a payout on chain #{chainId}", data),
            };
        case "MYSTERY_BUY":
            return {
                title: "MysteryBox obtained",
                subtitle: "You successfully obtained MysteryBox",
            };
        case "UPGRADE_BUY":
            return {
                title: "Increased / Guaranteed Allocation obtained",
                subtitle: "",
            };
        default:
            Sentry.captureException(new Error("Unsupported notification type"), { data: "NotificationMapper" });
            return {
                title: "",
                subtitle: "",
            };
    }
}

/**
 * @param {string} str
 * @param {Record<string, string | number>} data
 */
function replaceWithData(str, data) {
    let target = str;
    for (const [key, value] of Object.entries(data)) {
        target = target.replace(`{${key}}`, `${value}`);
    }
    return target;
}

const notificationsMapper = {
    mapNotificationTypeToContents,
};

export default notificationsMapper;
