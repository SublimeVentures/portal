const { Op, Sequelize } = require("sequelize");
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

function includeToNotification({
    model,
    attributes = [],
    dataId,
    typeIds = [],
    as,
    where = "",
    modelAttribute = "id",
}) {
    return [
        Sequelize.literal(`(
            SELECT row_to_json(sub)
            FROM (
                SELECT ${attributes.length > 0 ? `"${attributes.join('", "')}"` : "*"}
                FROM "${model}" AS "item"
                WHERE "item"."${modelAttribute}" = ("notification"."data"->>'${dataId}')::integer
                AND notification."typeId" IN (${typeIds.join(", ")})${where}
                LIMIT 1
            ) sub
        )`),
        as,
    ];
}

async function getNotifications(user, query) {
    try {
        const { where, limit, offset, sort } = buildWhereFromAuthorizedQuery(user, query);

        const data = await models.notification.findAndCountAll({
            where,
            limit,
            offset,
            order: [["id", sort.toUpperCase()]],
            include: [
                {
                    model: models.offer,
                    attributes: ["id", "name", "slug", "ticker"],
                },
                {
                    model: models.onchain,
                    attributes: ["id", "txID", "createdAt", "chainId"],
                },
                {
                    model: models.notificationType,
                    attributes: ["id", "name"],
                },
            ],
            attributes: {
                include: [
                    includeToNotification({
                        model: "storePartner",
                        modelAttribute: "storeId",
                        attributes: ["id", "img", "storeId"],
                        dataId: "item",
                        typeIds: [NotificationTypes.MYSTERY_BUY, NotificationTypes.UPGRADE_BUY],
                        where: ` AND "item"."tenantId" = "notification"."tenantId"`,
                        as: "upgrade",
                    }),

                    // data powinno miec otcId, otcId, otcDealId
                    // otcDealId = otcDeal.id - tylko to jest potrzebne, lecz nie wszystko w db to posiada

                    // dealId = otcDeal.dealId -> prawdopodobnie deal nadrzędny, czyli nie-cancel
                    // otcId = otcDeal.otcId
                    // Które pobrac?
                    includeToNotification({
                        model: "otcDeal",
                        attributes: [],
                        dataId: "otcDealId",
                        typeIds: [NotificationTypes.OTC_CANCEL, NotificationTypes.OTC_MADE, NotificationTypes.OTC_TAKE],
                        as: "otcDeal",
                    }),
                    includeToNotification({
                        model: "partner",
                        attributes: [],
                        dataId: "partnerId",
                        typeIds: [NotificationTypes.INVESTMENT],
                        as: "partner",
                    }),
                    includeToNotification({
                        model: "payout",
                        attributes: [],
                        dataId: "payoutId",
                        typeIds: [NotificationTypes.CLAIM],
                        as: "payout",
                    }),
                    includeToNotification({
                        model: "claim",
                        attributes: [],
                        dataId: "claimId",
                        typeIds: [NotificationTypes.CLAIM],
                        as: "claim",
                    }),
                ],
            },
        });
        return {
            ...data,
            limit,
            offset,
        };
    } catch (error) {
        logger.error("QUERY :: [getNotifications]", { error: serializeError(error) });
    }

    return { count: 0, rows: [] };
}

module.exports = { getNotifications };
