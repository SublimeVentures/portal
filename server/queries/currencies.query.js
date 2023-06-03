const {models} = require("../services/db");
const Sentry = require("@sentry/nextjs");

async function getPayableCurrencies(isDev) {
    try {
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
    } catch (e) {
        Sentry.captureException({location: "getPayableCurrencies", type: 'query', e});
    }
    return []
}


module.exports = {getPayableCurrencies}
