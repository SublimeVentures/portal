const { getEnv } = require("../services/env");
const { getOfferList, getLaunchpadList, getOtcList } = require("../queries/offers.query");

const OFFER_TYPES = {
    VC: "vc",
    LAUNCHPAD: "launchpad",
    OTC: "otc",
};

const offerTypeToFunction = {
    [OFFER_TYPES.VC]: getOfferList,
    [OFFER_TYPES.LAUNCHPAD]: getLaunchpadList,
    [OFFER_TYPES.OTC]: getOtcList,
};

async function getParamOfferList(user, req) {
    try {
        const { tenantId, partnerId } = user;
        const fetchFunction = offerTypeToFunction[req.query.type];
        if (!fetchFunction) throw Error("Bad type");

        const result = await fetchFunction(partnerId, tenantId, req.query.page, req.query.limit);

        return result;
    } catch (error) {
        return {
            ok: false,
            data: `Bad request ${error.message}`,
        };
    }
}

async function getOffersStats() {
    return getEnv().stats
}

module.exports = { getParamOfferList, getOffersStats };
