const {models} = require("../services/db/db.init");
const logger = require("../services/logger");
const {serializeError} = require("serialize-error");

async function getPayableCurrencies(isDev) {
    try {
        return await models.currency.findAll({
            attributes: ['address', 'precision', 'symbol', 'chainId'],
            where: {
                isSettlement: true
            },
            include: {
                attributes: ['isDev'],
                model: models.network, where: {isDev}
            },
            raw: true
        })
    } catch (error) {
        logger.error(`QUERY :: [getPayableCurrencies] listener`, {error: serializeError(error)});
    }
    return []
}


module.exports = {getPayableCurrencies}
