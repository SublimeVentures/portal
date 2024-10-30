const { serializeError } = require("serialize-error");
const { models } = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");
const db = require("../services/db/definitions/db.init");
async function getStore(partnerId, tenantId, query = {}) {
    const { sortBy = "storeId", order = "ASC" } = query;
    try {
        return await models.storePartner.findAll({
            where: {
                enabled: true,
                tenantId: tenantId,
            },
            include: [
                {
                    model: models.store,
                    as: "store",
                    attributes: [],
                },
            ],
            attributes: [
                [db.literal('CASE WHEN "availability" < 0 THEN 0 ELSE "availability" END'), "availability"],
                "price",
                "img",
                [db.literal('"store"."id"'), "id"],
                [db.literal('"store"."name"'), "name"],
                [db.literal('"store"."description"'), "description"],
            ],
            raw: true,
            order: [[sortBy, order]],
        });
    } catch (error) {
        logger.error("QUERY :: [getStore]", { error: serializeError(error) });
    }
    return [];
}

module.exports = { getStore };
