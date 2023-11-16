const { models } = require('../services/db/db.init');
const {isBased} = require("../../src/lib/utils");

async function getEnvironment() {
    //initialize environment
    let environment = {}

    //PAARAMS :: fetch global `environment
    const envGlobal_raw = await models.environment.findAll({raw: true});
    const envGlobal = Object.assign({}, ...(envGlobal_raw.map(item => ({ [item.name]: item.value }) )));
    environment = {...envGlobal, ...environment}

    //PARAMS :: fetch `environment_TENANT` table
    let envTenant_raw
    if(isBased) {
        envTenant_raw = await models.environment_based.findAll({raw: true});
    } else {
        envTenant_raw = await models.environment_citcap.findAll({raw: true});
    }
    const envTenant = Object.assign({}, ...(envTenant_raw.map(item => ({ [item.name]: item.value ? item.value : item.valueJSON }) )));
    environment = {...envTenant, ...environment}



    //PRAM :: `isDev`
    const isDev = process.env.ENV !== 'production' && process.env.isForceDev !== 'true';
    environment.isDev = isDev;


    //PARAM :: `diamond`
    const diamonds = await models.diamond.findAll({include: {model: models.network}, raw: true});
    let parsedDiamonds = {}
    diamonds.forEach(el => {
        if(parsedDiamonds[el.tenant]) {
            parsedDiamonds[el.tenant][el.networkChainId] = el.address
        } else {
            parsedDiamonds[el.tenant] = {}
            parsedDiamonds[el.tenant][el.networkChainId] = el.address
        }
    })
    environment.diamond = isBased ? parsedDiamonds.basedVC : parsedDiamonds.CitCap


    //PARAM :: `diamondBased`
    environment.diamondBased = parsedDiamonds.basedVC


    //PARAM :: `currencies`
    const currencies = await models.currency.findAll({where: {isSettlement: true}, include: {model: models.network, where: {isDev}}, raw: true});
    let parsedCurrencies = {}
    currencies.forEach(el => {
        if(!parsedCurrencies[el.networkChainId]) parsedCurrencies[el.networkChainId] = {}
        parsedCurrencies[el.networkChainId][el.address] = {name: el.name, symbol: el.symbol, precision: el.precision, isSettlement: el.isSettlement}
    })
    environment.currencies = parsedCurrencies


    //PARAM :: `currenciesStore`
    const currenciesStore = isBased ? currencies : await models.currency.findAll({where: {isSettlement: false}, include: {model: models.network, where: {isDev}}, raw: true});
    let parsedCurrenciesStore = {}

    currenciesStore.forEach(el => {
        if(!parsedCurrenciesStore[el.networkChainId]) parsedCurrenciesStore[el.networkChainId] = {}
        parsedCurrenciesStore[el.networkChainId][el.address] = {name: el.name, symbol: el.symbol, precision: el.precision, isSettlement: el.isSettlement}
    })
    environment.currenciesStore = parsedCurrenciesStore


    //PARAM :: `stats`
    environment.stats = {}
    //-- PARAM :: `stats.partners`
    const partners = await models.partner.findAll({where: {isEnabled: true}, raw: true});
    environment.stats.partners = partners.reduce((max, partner) => {
        return (partner.uniquePartner > max) ? partner.uniquePartner : max;
    }, 0);
    //-- PARAM :: `stats.funded`
    const offers = await models.offer.findAll({raw: true});
    const funded = offers.map(item => item.alloRaised).reduce((prev, next) => prev + next);
    environment.stats.funded = funded + Number(environment.investedInjected)


    //-- PARAM :: `ntData`
    if(!isBased) {
        environment.ntData = {
            S1: partners.find(el => el.symbol === "NTCTZN")?.address,
            S2: partners.find(el => el.symbol === "NTOCTZN")?.address,
            staked: partners.find(el => el.symbol === "CTZN")?.address,
            transcendence: partners.find(el => el.symbol === "CITCAP")?.address,
        }
    }

    return environment
}

module.exports = { getEnvironment }
