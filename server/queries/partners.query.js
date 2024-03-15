const { models } = require("../services/db/definitions/db.init");
const { Op } = require("sequelize");
const logger = require("../../src/lib/logger");

const { serializeError } = require("serialize-error");

async function getPublicPartners() {
    try {
        return await models.partner.findAll({
            attributes: [
                "logo",
                "name",
                "slug",
                "id",
                "acl",
                "displayOrder",
                "isNewLabel",
            ],
            where: {
                isVisible: true,
            },
            raw: true,
        });
    } catch (error) {
        logger.error("QUERY :: [getPublicPartners]", {
            error: serializeError(error),
        });
    }
    return [];
}

module.exports = { getPublicPartners };
