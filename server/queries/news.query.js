const { Op } = require("sequelize");
const { serializeError } = require("serialize-error");
const { models } = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");

const getLatestNewsForPartner = async (partnerId, tenantId) => {
    try {
        return await models.news.findOne({
            where: {
                partnerId: {
                    [Op.in]: [partnerId, tenantId],
                },
                publishDate: {
                    [Op.lt]: new Date(),
                    [Op.ne]: null,
                },
            },
            order: [["publishDate", "DESC"]],
        });
    } catch (error) {
        logger.error("QUERY :: [getLatestNewsForPartner]", {
            error: serializeError(error),
            partnerId,
        });
        return null;
    }
};

module.exports = { getLatestNewsForPartner };
