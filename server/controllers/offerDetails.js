const { serializeError } = require("serialize-error");
const { getOfferDetails, getOfferFunding } = require("../queries/offers.query");
const logger = require("../../src/lib/logger");

async function getParamOfferDetails(user, req) {
    const { partnerId, tenantId } = user;

    const results = await getOfferDetails(req.params.slug, partnerId, tenantId);
    console.log("offer result", results);

    const offer = results[0];
    if (!offer) return { ok: false };

    return {
        ok: true,
        id: offer.offerId,
        ppu: offer.ppu,
        name: offer.name,
        dealStructure: offer.dealStructure,
        genre: offer.genre,
        ticker: offer.ticker,
        tge: offer.tge,
        url_discord: offer.url_discord,
        url_twitter: offer.url_twitter,
        url_web: offer.url_web,
        slug: offer.slug,
        t_vesting: offer.t_vesting,
        t_cliff: offer.t_cliff,
        t_unlock: offer.t_unlock,
        t_start: offer.t_start,
        media: offer.media,
        isAccelerator: offer.isAccelerator,
        isLaunchpad: offer.isLaunchpad,
        isManaged: offer.isManaged,
        alloMin: offer.alloMin,
        alloMax: offer.alloMax,
        alloLimit: offer.alloLimit,
        alloRaised: offer.alloRaised,
        alloTotal: offer.alloTotal,
        d_open: offer.d_open,
        d_close: offer.d_close,
        lengthWhales: offer.lengthWhales,
        lengthRaffle: offer.lengthRaffle,
        lengthFCFS: offer.lengthFCFS,
        lengthUnlimitedSlowdown: offer.lengthUnlimitedSlowdown,
        lengthGuaranteed: offer.lengthGuaranteed,
        description: offer.description,
        isOtcExclusive: offer.isOtcExclusive,
        isSettled: offer.isSettled,
    };
}

async function getOfferAllocation(user, req) {
    try {
        const { partnerId, tenantId } = user;
        const results = await getOfferFunding(Number(req.params.id), partnerId, tenantId);
        const allocation = results[0];

        return {
            alloRes: allocation.alloRes + allocation.alloResInjected,
            alloFilled: allocation.isSettled
                ? allocation.alloRaised
                : allocation.alloFilled + allocation.alloFilledInjected,
            alloGuaranteed: allocation.alloGuaranteed + allocation.alloGuaranteedInjected,
            isPaused: allocation.isPaused,
            isSettled: allocation.isSettled,
            isRefund: allocation.isRefund,
        };
    } catch (error) {
        logger.error(`Can't fetch offerFundraise`, {
            error: serializeError(error),
            params: req.params,
        });

        return {
            alloRes: 0,
            alloFilled: 0,
            alloGuaranteed: 0,
            isPaused: false,
            isSettled: false,
            isRefund: false,
        };
    }
}

module.exports = { getParamOfferDetails, getOfferAllocation };
