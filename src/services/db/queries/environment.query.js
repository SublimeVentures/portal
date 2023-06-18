import db from "@/services/db/db.setup"


export const getEnvironment = async () => {
    const isDev = process.env.ENV !== 'production';
    const envVars = await db.models.environment.findAll({raw: true});
    const multichain = await db.models.multichain.findAll({include: {model: db.models.networks, where: {isDev}}, raw: true});
    const currencies = await db.models.currencies.findAll({include: {model: db.models.networks, where: {isDev}}, raw: true});
    const projects = await db.models.offers.findAll({raw: true});
    const partners = await db.models.partners.count({where: {isEnabled: true}, raw: true});
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

    const funded = projects.map(item => item.alloRaised).reduce((prev, next) => prev + next);

    env.currencies = parsedCurrencies
    env.multichain = parsedMultichain

    env.stats = {
        investments: projects.length,
        partners: partners,
        funded: funded + Number(env.investedInjected),
    }
    env.isDev = isDev;
    return env
}

module.exports = { getEnvironment }
