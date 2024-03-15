const { models } = require("../services/db/definitions/db.init");
const { Op } = require("sequelize");
const logger = require("../../src/lib/logger");
const { serializeError } = require("serialize-error");
const { TENANT } = require("../../src/lib/tenantHelper");

async function getNeoTokyoEnvs() {
    try {
        const result = await models.environment.findAll({
            attributes: ["valueJSON"],
            where: {
                name: {
                    [Op.in]: [
                        "rewardRate",
                        "allocationTrait",
                        "stakingTimelock",
                        "allocationBase",
                    ],
                },
                partnerId: TENANT.NeoTokyo,
            },
        });

        return result.map((row) => row.valueJSON);
    } catch (error) {
        logger.error("QUERY :: [getNeoTokyoEnvs]", {
            error: serializeError(error),
        });
    }
    return [];
}

module.exports = { getNeoTokyoEnvs };
