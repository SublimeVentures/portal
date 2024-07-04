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
        const { type, limit, isSettled, page } = req.query;
        const fetchFunction = offerTypeToFunction[type];
        if (!fetchFunction) throw Error("Bad type");

        const result = await fetchFunction(partnerId, tenantId, {
            ...(page && { page: parseInt(page, 10) }),
            ...(limit && { limit: parseInt(limit, 10) }),
            ...(isSettled && { isSettled: isSettled === "true" }),
        });

        return result;
    } catch (error) {
        return {
            ok: false,
            data: `Bad request ${error.message}`,
        };
    }
}

async function getOffersStats() {
    return getEnv().stats;
}

module.exports = { getParamOfferList, getOffersStats };
