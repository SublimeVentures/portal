const {models} = require("../services/db");

async function getPayableCurrencies(isDev) {
    return await models.currencies.findAll({
        attributes: ['address', 'precision', 'symbol', 'networkChainId'],
        where: {
            isSettlement: true
        },
        include: {
            attributes: ['isDev'],
            model: models.networks, where: {isDev}
        },
        raw: true
    })
}


module.exports = { getPayableCurrencies }
