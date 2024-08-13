const { Op } = require("sequelize");
const { serializeError } = require("serialize-error");
const { models } = require("../services/db/definitions/db.init");
const { NotificationTypes } = require("../../src/v2/enum/notifications");
const logger = require("../../src/lib/logger");

function buildWhereFromAuthorizedQuery(user, query) {
    const { userId, tenantId } = user;
    const { limit = 12, offset = 0, sort = "asc", ...whereQuery } = query;

    const where = {};
    where["userId"] = userId;
    where["tenantId"] = { [Op.in]: [tenantId, null, 0] };
    if (whereQuery.before && whereQuery.after) {
        where["created_at"] = {
            [Op.between]: [whereQuery.before, whereQuery.after],
        };
    } else if ("before" in whereQuery) {
        where["created_at"] = { [Op.lte]: new Date(whereQuery.before) };
    } else if ("after" in whereQuery) {
        where["created_at"] = { [Op.gte]: new Date(whereQuery.after) };
    } else {
        for (const [key, value] of Object.entries(whereQuery)) {
            where[key] = value;
        }
    }

    return {
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        where,
        sort,
    };
}

async function getNotifications(user, query) {
    try {
        const { where, limit, offset, sort } = buildWhereFromAuthorizedQuery(user, query);

        const notifications = await models.notification.findAndCountAll({
            where,
            limit,
            offset,
            order: [["id", sort.toUpperCase()]],
            raw: true,
        });

        return {
            ...notifications,
            limit,
            offset,
        };
    } catch (error) {
        logger.error("QUERY :: [getNotifications]", { error: serializeError(error) });
    }

    return { count: 0, rows: [] };
}

async function buildFullNotifications(baseNotifications) {
    return Promise.all(
        baseNotifications.map((notif) => {
            return enrichBaseNotification(notif)
                .then((baseNotif) => {
                    switch (baseNotif.typeId) {
                        case NotificationTypes.MYSTERY_BUY:
                            return enrichMysteryBuyNotification(baseNotif);
                        case NotificationTypes.UPGRADE_BUY:
                            return enrichUpgradeBuyNotification(baseNotif);
                        case NotificationTypes.OTC_CANCEL:
                        case NotificationTypes.OTC_MADE:
                        case NotificationTypes.OTC_TAKE:
                            return enrichOtcNotification(baseNotif);
                        case NotificationTypes.INVESTMENT:
                            return enrichInvestmentNotification(baseNotif);
                        case NotificationTypes.REFUND:
                            return enrichReturnNotification(baseNotif);
                        case NotificationTypes.CLAIM:
                            return enrichClaimNotification(baseNotif);
                        default:
                            return baseNotif;
                    }
                })
                .catch((err) => {
                    console.log("[Notifications] After-enrichment Processing Error:", err.message);
                    return notif;
                });
        }),
    );
}

async function enrichBaseNotification(plainNotification) {
    try {
        const offer = await models.offer.findOne({
            where: {
                id: plainNotification.offerId,
            },
            raw: true,
        });
        const onchain = await models.onchain.findOne({
            where: {
                id: plainNotification.onchainId,
            },
            raw: true,
        });
        const chain = await models.network.findOne({
            where: {
                id: plainNotification.chainId,
            },
            raw: true,
        });
        return {
            ...plainNotification,
            offer,
            onchain,
            chain,
        };
    } catch (err) {
        console.log("[Notifications] Base Enrichment Error:", err.message);
        return plainNotification;
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
        console.log("[Notifications] MYSTERY_BUY Enrichment Error:", err.message);
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
        console.log("[Notifications] UPGRADE_BUY Enrichment Error:", err.message);
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
        console.log("[Notifications] OTC Enrichment Error:", err.message);
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
        console.log("[Notifications] INVEST Enrichment Error:", err.message);
        return plainNotification;
    }
}

async function enrichReturnNotification(plainNotification) {
    return plainNotification;
}

async function enrichClaimNotification(plainNotification) {
    try {
        const claim = await models.claim.findOne({
            where: {
                id: plainNotification.data.claimId,
            },
            raw: true,
        });
        const payout = await models.payout.findOne({
            where: {
                id: plainNotification.data.payoutId,
            },
            raw: true,
        });
        return {
            ...plainNotification,
            claim,
            payout,
        };
    } catch (err) {
        console.log("[Notifications] CLAIM Enrichment Error:", err.message);
        return plainNotification;
    }
}

module.exports = {
    getNotifications,
};
