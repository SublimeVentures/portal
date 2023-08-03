const { models } = require('../services/db/db.init');
const {isBased} = require("../../src/lib/utils");


async function getEnvironment() {
    const isDev = process.env.ENV !== 'production';
    const envVars = await models.environment.findAll({raw: true});
    const currencies = await models.currencies.findAll({ where: {isSettlement: true},include: {model: models.networks, where: {isDev}}, raw: true});
    const projects = await models.offers.findAll({raw: true});
    const partners = await models.partners.findAll({where: {isEnabled: true}, raw: true});
    let env = Object.assign({}, ...(envVars.map(item => ({ [item.name]: item.value }) )));
    let parsedCurrencies = {}
    currencies.forEach(el => {
        if(!parsedCurrencies[el.networkChainId]) parsedCurrencies[el.networkChainId] = {}
        parsedCurrencies[el.networkChainId][el.address] = {name: el.name, symbol: el.symbol, precision: el.precision, isSettlement: el.isSettlement}
    })


    const funded = projects.map(item => item.alloRaised).reduce((prev, next) => prev + next);
    env.cdn = isBased ? env.cdn3VC : env.cdnCitCap;
    env.currencies = parsedCurrencies
    env.ntData = {
        S1: partners.find(el => el.name === "Neo Tokyo Citizen S1")?.address,
        S2: partners.find(el => el.name === "Neo Tokyo Citizen S2")?.address,
        staked: partners.find(el => el.name === "Neo Tokyo Citizen (staked)")?.address,
        transcendence: partners.find(el => el.name === "Citizen Capital Transcendence")?.address,
    }
    env.stats = {
        partners: partners.filter(el=> el.level !== Number(env["ntLevel"])).length + 1,
        funded: funded + Number(env.investedInjected),
    }
    env.isDev = isDev;
    return env
}

module.exports = { getEnvironment }
