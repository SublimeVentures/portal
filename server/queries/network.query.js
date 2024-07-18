const { models } = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");
const { serializeError } = require("serialize-error");

async function getNetworkList() {
    try {
        const res = await models.network.findAll({
            attributes: [
                "chainId",
                "name",
                "isSupported",
            ],
            raw: true,
        });

        return res
    } catch (error) {
        console.log('err', error)
        logger.error("QUERY :: [getNetworkList]", { error: serializeError(error) });
    }
    return [];
}

module.exports = { getNetworkList };