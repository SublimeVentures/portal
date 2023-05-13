const {getEnv} = require("../services/db/utils");
const {getActiveOffers, getHistoryOffers} = require("../queries/otc.query");
const {getParamOfferList} = require("./offerList");


async function getMarkets(session, req) {
    const offers = await getParamOfferList(session, req)

    return {
        open: offers.filter(el=> el.otc !== 0),
        source: getEnv().diamond,
        otcFee: getEnv().feeOtc,
        currencies: getEnv().currencies
    }
}

async function getOffers(session, req) {
    const ID = Number(req.params.id)
    return await getActiveOffers(ID)
}

async function getHistory(session, req) {
    const ID = Number(req.params.id)
    return await getHistoryOffers(ID)
}


module.exports = {getMarkets, getOffers, getHistory}
