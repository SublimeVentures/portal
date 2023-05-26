const moment = require("moment");
const {checkAcl} = require("./acl");
const {getOfferDetails} = require("../queries/offers.query");
const {getEnv} = require("../services/db/utils");
const {getOfferRaise} = require("../queries/invest.query");
const {ACL: ACLs} = require("../../src/lib/acl");
const {getInjectedUserAccess} = require("../queries/injectedUser.query");


async function getParamOfferDetails(session, req) {
    const {ACL, ADDRESS} = checkAcl(session, req)

    const offer = await getOfferDetails(req.params.slug);
    if (!offer) return {}
    let template = {
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
        icon: offer.icon,
        name: offer.name,
        ticker: offer.ticker,
        tge: offer.tge,
        access: offer.access,
        url_discord: offer.url_discord,
        url_twitter: offer.url_twitter,
        url_web: offer.url_web,
        t_cliff: offer.t_cliff,
        t_vesting: offer.t_vesting,
        rrPages: offer.rrPages,
        slug: offer.slug,
        vault: offer.vault,
        whale: getEnv().whaleId,
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
            response.offer = getOfferDetailsWhale(offer, template)
            break;
        }
        case ACLs.PartnerInjected: {
            response.offer = await fillInjectedPartnerData(offer, template, ADDRESS)
            break;
        }
        default: {
            response.offer =  fillPartnerData(offer, template)
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

async function fillInjectedPartnerData(offer, template, address) {
    const user = await getInjectedUserAccess(address)
    if(!user) return false

    const haveAccess = user.access.find(el => el === offer.id)
    if(!haveAccess) return false

    return fillPartnerData(offer, template);
}

function fillPartnerData(offer, template) {
    if (offer.accessPartnerDate && offer.accessPartnerDate > moment.utc()) {
        return false
    }
    template.d_open = offer.d_openPartner ? offer.d_openPartner : offer.d_open + Number(getEnv().partnerDelay)
    template.d_close = offer.d_closePartner ? offer.d_closePartner : offer.d_close + Number(getEnv().partnerDelay)
    template.alloTotal = offer.alloTotalPartner ? offer.alloTotalPartner : offer.alloTotal;
    template.alloRequired = offer?.alloRequiredPartner >= 0 ? offer.alloRequiredPartner : offer.alloTotal;
    template.alloMax = offer.alloMaxPartner ? offer.alloMaxPartner : offer.alloMin * Number(getEnv().partnerDefaultMulti);
    return template;
}

async function getOfferAllocation(session, req) {
    const {ACL} = checkAcl(session, req)
    const data = await getOfferRaise(Number(req.params.id))
    const allocation = data.get({plain: true})
    if(allocation.offer.alloTotalPartner > 0 && ACL !== 0) {
        return {
            alloFilled: allocation.alloFilledPartner + allocation.alloSidePartner,
            alloRes: allocation.alloResPartner
        }
    } else {
        return {
            alloFilled: allocation.alloFilled + allocation.alloSide,
            alloRes: allocation.alloRes
        }
    }
}


module.exports = {getParamOfferDetails, getOfferAllocation}
