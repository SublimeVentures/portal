const {getEnv} = require("../services/db");
const {getOfferList} = require("../queries/offers.query");

async function getPermittedOfferList(user) {
    const {tenantId, partnerId} = user
    return await getOfferList(partnerId, tenantId)
}

async function getParamOfferList(user) {
    return {
        stats: getEnv().stats,
        offers: await getPermittedOfferList(user)
    }
}

module.exports = {getParamOfferList, getPermittedOfferList}
