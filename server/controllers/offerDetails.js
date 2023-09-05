const moment = require("moment");
const {getOfferDetails} = require("../queries/offers.query");
const {getEnv} = require("../services/db/");
const {getOfferRaise} = require("../queries/invest.query");
const {ACLs, OfferAccessACL} = require("../../src/lib/authHelpers");
const {getInjectedUserAccess} = require("../queries/injectedUser.query");


async function getParamOfferDetails(user, req) {
    const {ACL, address} = user

    const offer = await getOfferDetails(req.params.slug);
    if (!offer) return {notExist: true}
    let template = {
        whale: getEnv().whaleId,
        cdn: getEnv().cdn,
        id: offer.id,
        alloMin: offer.alloMin,
        isPaused: offer.isPaused,
        isSettled: offer.isSettled,
        isPhased: offer.isPhased,
        ppu: offer.ppu,
        tax: offer.tax,
        dealStructure: offer.dealStructure,
        description: offer.description,
        genre: offer.genre,
        name: offer.name,
        ticker: offer.ticker,
        tge: offer.tge,
        access: offer.access,
        url_discord: offer.url_discord,
        url_twitter: offer.url_twitter,
        url_web: offer.url_web,
        t_cliff: offer.t_cliff,
        t_vesting: offer.t_vesting,
        slug: offer.slug,
        vault: offer.vault,
        media: offer.media,
        isCitCapX: offer.isCitCapX,
        d_open: null,
        d_close: null,
        alloTotal: null,
        alloRequired: null,
        alloMax: null
    }


    let response = {}
    response.currencies = getEnv().currencies

    switch (ACL) {
        case ACLs.Whale: {
            if(OfferAccessACL[ACL][offer.access]) {
                response.offer = getOfferDetailsWhale(offer, template)
            }
            break;
        }
        case ACLs.Member: {
            if(OfferAccessACL[ACL][offer.access]) {
                response.offer = getOfferDetailsPartner(offer, template)
            }
            break;
        }
        case ACLs.NeoTokyo: {
            if(OfferAccessACL[ACL][offer.access]) {
                response.offer = getOfferDetailsPartner(offer, template)
            }
            break;
        }

        case ACLs.PartnerInjected: {
            response.offer = await fillInjectedPartnerData(offer, template, address)
            break;
        }
        case ACLs.Admin: {
            if(OfferAccessACL[ACL][offer.access]) {
                response.offer = getOfferDetailsWhale(offer, template)
            }
            break;
        }
        default: {
            if(OfferAccessACL[ACL][offer.access]) {
                response.offer = getOfferDetailsPartner(offer, template)
            }
            break;
        }
    }

    return response


}

function getOfferDetailsWhale(offer, template) {
    template.d_open = offer.d_open;
    template.d_close = offer.d_close;
    template.alloTotal = offer.alloTotal;
    template.alloRequired = offer.alloRequired;
    template.alloMax = offer.alloMax ? offer.alloMax : offer.alloTotal;
    return template;
}

function getOfferDetailsPartner(offer, template) {
    if (offer.accessPartnerDate && offer.accessPartnerDate > moment.utc()) {
        return false
    }
    template.d_open = offer.d_openPartner
    template.d_close = offer.d_closePartner
    template.alloTotal = offer.alloTotalPartner ? offer.alloTotalPartner : offer.alloTotal;
    template.alloRequired = offer?.alloRequiredPartner >= 0 ? offer.alloRequiredPartner : offer.alloTotal;
    template.alloMax = offer.alloMaxPartner ? offer.alloMaxPartner : 0;
    return template;
}

async function fillInjectedPartnerData(offer, template, address) {
    const user = await getInjectedUserAccess(address)
    if(!user) return false

    const haveAccess = user.access.find(el => el === offer.id)
    if(!haveAccess) return false

    return getOfferDetailsPartner(offer, template);
}


async function getOfferAllocation(user, req) {
    const {ACL} = user
    const data = await getOfferRaise(Number(req.params.id))
    const allocation = data.get({plain: true})
    if(allocation.offer.alloTotalPartner > 0 && ACL !== 0) {
        return {
            alloFilled: allocation.alloFilledPartner + allocation.alloSidePartner,
            alloRes: allocation.alloResPartner + allocation.alloGuaranteed
        }
    } else {
        return {
            alloFilled: allocation.alloFilled + allocation.alloSide,
            alloRes: allocation.alloRes + allocation.alloGuaranteed
        }
    }
}


module.exports = {getParamOfferDetails, getOfferAllocation}
