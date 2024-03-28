const { getEnv } = require("../services/env");
const { getOfferList } = require("../queries/offers.query");

const OFFER_TYPES = {
    VC: "vc",
    LAUNCHPAD: "launchpad",
    OTC: "otc",
};

async function getParamOfferList(user, req) {
    try {
        const { tenantId, partnerId } = user;

        switch (req.query.type) {
            case OFFER_TYPES.VC: {
                return {
                    stats: getEnv().stats,
                    offers: await getOfferList(partnerId, tenantId),
                };
            }
            case OFFER_TYPES.LAUNCHPAD: {
                return {
                    stats: getEnv().stats,
                    offers: await getLaunchpadList(partnerId, tenantId),
                };
            }
            case OFFER_TYPES.OTC: {
                return {
                    stats: getEnv().stats,
                    offers: await getOtcList(partnerId, tenantId),
                };
            }
            default: {
                throw Error("Bad type");
            }
        }
    } catch (error) {
        return {
            ok: false,
            data: `Bad request ${error.message}`,
        };
    }
}

module.exports = { getParamOfferList };
