const { getOfferDetails } = require("../queries/offers.query");
const { getOfferRaise } = require("../queries/invest.query");
const logger = require("../../src/lib/logger");
const { serializeError } = require("serialize-error");

async function getParamOfferDetails(user, req) {
    const { partnerId, tenantId } = user;

    const results = await getOfferDetails(req.params.slug, partnerId, tenantId);
    const offer = results[0];
    if (!offer) return { ok: false };
    //todo: lengthWale, lengthRaffle

    return {
        ok: true,
        id: offer.offerId,
        slug: offer.slug,
        name: offer.name,
        dealStructure: offer.dealStructure,
        genre: offer.genre,
        description: offer.description,
        ppu: offer.ppu,
        ppuOriginal: offer.ppuOriginal,
        ticker: offer.ticker,
        tax: offer.tax,
        tge: offer.tge,
        t_cliff: offer.t_cliff,
        t_vesting: offer.t_vesting,
        url_discord: offer.url_discord,
        url_twitter: offer.url_twitter,
        url_web: offer.url_web,
        media: offer.media,
        isAccelerator: offer.isAccelerator,
        isLaunchpad: offer.isLaunchpad,
        //per limits
        alloMin: offer.alloMin,
        alloMax: offer.alloMax,
        d_open: offer.d_open,
        d_close: offer.d_close,
        lengthFCFS: offer.lengthFCFS,
        lengthGuaranteed: offer.lengthGuaranteed,
    };
}

async function getOfferAllocation(req) {
    try {
        const data = await getOfferRaise(Number(req.params.id));
        const allocation = data.get({ plain: true });

        return {
            alloRes: allocation.alloRes,
            alloFilled: allocation.alloFilled + allocation.alloFilledInjected,
            alloGuaranteed: allocation.alloGuaranteed + allocation.alloGuaranteedInjected,
            alloTotal: allocation.alloTotal,
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
            alloTotal: 0,
            isPaused: false,
            isSettled: false,
            isRefund: false,
        };
    }
}

module.exports = { getParamOfferDetails, getOfferAllocation };
