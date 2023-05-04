const {getOffersWithOpenOtc} = require("../queries/offer");
const {getEnv} = require("../services/mongo");
const {getActiveOffers, getHistoryOffers} = require("../queries/otc");


async function getMarkets() {
    let markets = await getOffersWithOpenOtc()
    return markets ? {open: markets, source: getEnv().diamond, otcFee: getEnv().feeOtc, currencies: getEnv().currency} : {open: markets}
}

async function getOffers(req) {
    const ID = Number(req.params.id)
    return await getActiveOffers(ID)
}

async function getHistory(req) {
    const ID = Number(req.params.id)
    return await getHistoryOffers(ID)
}


module.exports = {getMarkets, getOffers, getHistory}
