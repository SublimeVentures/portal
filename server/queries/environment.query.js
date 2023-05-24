const { models } = require('../services/db/index');

async function getEnvironment() {
    const isDev = process.env.NODE_ENV !== 'production';
    const envVars = await models.environment.findAll({raw: true});
    const multichain = await models.multichain.findAll({include: {model: models.networks, where: {isDev}}, raw: true});
    const currencies = await models.currencies.findAll({include: {model: models.networks, where: {isDev}}, raw: true});
    let env = Object.assign({}, ...(envVars.map(item => ({ [item.name]: item.value }) )));
    let parsedCurrencies = {}
    let parsedMultichain = {}
    currencies.forEach(el => {
        if(!parsedCurrencies[el.networkChainId]) parsedCurrencies[el.networkChainId] = {}
        parsedCurrencies[el.networkChainId][el.address] = {name: el.name, symbol: el.symbol, precision: el.precision, isSettlement: el.isSettlement}
    })
    multichain.forEach(el => {
        parsedMultichain[el.networkChainId] = el.address
    })
    env.currencies = parsedCurrencies
    env.multichain = parsedMultichain
    env.isDev = isDev;

    return env
}

module.exports = { getEnvironment }
