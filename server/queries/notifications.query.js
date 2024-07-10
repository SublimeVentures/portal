const { Op } = require("sequelize");
const { models } = require("../services/db/definitions/db.init");
const { NotificationTypes } = require("../../src/v2/enum/notifications");

function buildWhereFromAuthorizedQuery(user, query) {
    const { userId, tenantId } = user;
    const { size = 12, last = null, sort = "asc", ...whereQuery } = query;
    const where = {};
    where["userId"] = userId;
    where["tenantId"] = { [Op.in]: [tenantId, null, 0] };
    if (last) {
        where["id"] = {
            [sort === "asc" ? Op.gt : Op.lt]: last,
        };
    }
    if (whereQuery.before && whereQuery.after) {
        where["created_at"] = { [Op.between]: [whereQuery.before, whereQuery.after] };
    } else if ("before" in whereQuery) {
        where["created_at"] = { [Op.lte]: new Date(whereQuery.before) };
    } else if ("after" in whereQuery) {
        where["created_at"] = { [Op.gte]: new Date(whereQuery.after) };
    } else {
        for (const [key, value] of Object.entries(whereQuery)) {
            where[key] = value;
        }
    }
    return { size, where, sort };
}

async function getNotifications(user, query) {
    try {
        const { where, size, sort } = buildWhereFromAuthorizedQuery(user, query);
        const notifications = await models.notification.findAll({
            where,
            raw: true,
            limit: size,
            order: [["id", sort.toUpperCase()]],
        });
        if (!notifications.length) {
            return {
                last: null,
                notifications: [],
            };
        }
        const last = notifications[notifications.length - 1].id;
        return {
            last,
            notifications: await Promise.all(
                notifications.map((notif) => {
                    switch (notif.typeId) {
                        case NotificationTypes.MYSTERY_BUY:
                            return enrichMysteryBuyNotification(notif);
                        case NotificationTypes.UPGRADE_BUY:
                            return enrichUpgradeBuyNotification(notif);
                        case NotificationTypes.OTC_CANCEL:
                        case NotificationTypes.OTC_MADE:
                        case NotificationTypes.OTC_TAKE:
                            return enrichOtcNotification(notif);
                        case NotificationTypes.INVESTMENT:
                            return enrichInvestmentNotification(notif);
                        case NotificationTypes.REFUND:
                            return enrichReturnNotification(notif);
                        case NotificationTypes.CLAIM:
                            return enrichClaimNotification(notif);
                        default:
                            return notif;
                    }
                }),
            ),
        };
    } catch (err) {
        console.log("[Notifications] Fetch Error:", err.message);
        return {
            next: null,
            notifications: [],
        };
    }
}

async function enrichMysteryBuyNotification(plainNotification) {
    try {
        const item = await models.storePartner.findOne({
            where: {
                id: plainNotification.data.item,
            },
            raw: true,
        });
        return {
            ...plainNotification,
            item,
        };
    } catch (err) {
        console.log("[Notifications] Enrichment Error:", err.message);
        return plainNotification;
    }
}

async function enrichUpgradeBuyNotification(plainNotification) {
    try {
        const item = await models.storePartner.findOne({
            where: {
                id: plainNotification.data.item,
            },
            raw: true,
        });
        return {
            ...plainNotification,
            item,
        };
    } catch (err) {
        console.log("[Notifications] Enrichment Error:", err.message);
        return plainNotification;
    }
}

async function enrichOtcNotification(plainNotification) {
    try {
        const otcDeal = await models.otcDeal.findOne({
            where: {
                id: plainNotification.data.otcDealId,
            },
            raw: true,
        });
        return {
            ...plainNotification,
            otcDeal,
        };
    } catch (err) {
        console.log("[Notifications] Enrichment Error:", err.message);
        return plainNotification;
    }
}

async function enrichInvestmentNotification(plainNotification) {
    try {
        const partner = await models.partner.findOne({
            where: {
                id: plainNotification.data.partnerId,
            },
            raw: true,
        });
        return {
            ...plainNotification,
            partner,
        };
    } catch (err) {
        console.log("[Notifications] Enrichment Error:", err.message);
        return plainNotification;
    }
}

async function enrichReturnNotification(plainNotification) {
    return plainNotification;
}

async function enrichClaimNotification(plainNotification) {
    let claim;
    let payout;
    try {
        claim = await models.claim.findOne({
            where: {
                id: plainNotification.data.claimId,
            },
            raw: true,
        });
    } catch (err) {
        console.log("[Notifications] Enrichment Error:", err.message);
        claim = null;
    }
    try {
        payout = await models.payout.findOne({
            where: {
                id: plainNotification.data.payoutId,
            },
            raw: true,
        });
    } catch (err) {
        console.log("[Notifications] Enrichment Error:", err.message);
        payout = null;
    }

    return {
        ...plainNotification,
        claim,
        payout,
    };
}

module.exports = {
    getNotifications,
};
