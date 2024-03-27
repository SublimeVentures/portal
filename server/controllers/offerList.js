const { getEnv } = require("../services/env");
const { getOfferList } = require("../queries/offers.query");

async function getPermittedOfferList(user, isOtc) {
    const { tenantId, partnerId } = user;
    return await getOfferList(partnerId, tenantId, isOtc);
}

async function getParamOfferList(user) {
    return {
        stats: getEnv().stats,
        offers: await getPermittedOfferList(user),
    };
}

module.exports = { getParamOfferList, getPermittedOfferList };
