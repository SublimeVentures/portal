const {getEnv} = require("../services/mongo");
const {getOfferDetails, getOfferAllocationData} = require("../queries/offer");
const moment = require("moment");
const {getInjectedUser} = require("../queries/injectedUser");
const {checkAcl} = require("./acl");


async function getParamOfferDetails(session, req) {
    const {ACL, ADDRESS} = checkAcl(session, req)

    console.log("SLUG DATA session", session)
    console.log("SLUG DATA req.query", req.query)
    console.log("SLUG DATA acl", ACL)
    console.log("SLUG DATA address", ADDRESS)

    const offer = await getOfferDetails(req.params.slug);
    if(!offer) return {}

    let template = {
        id: offer.id,
        b_alloMin: offer.b_alloMin,
        b_isPaused: offer.b_isPaused,
        b_isSettled: offer.b_isSettled,
        b_ppu: offer.b_ppu,
        b_tax: offer.b_tax,
        dealStructure: offer.dealStructure,
        description: offer.description,
        genre: offer.genre,
        icon: offer.icon,
        name: offer.name,
        ticker: offer.ticker,
        tge: offer.tge,
        url_discord: offer.url_discord,
        url_twitter: offer.url_twitter,
        url_web: offer.url_web,
        t_cliff: offer.t_cliff,
        t_vesting: offer.t_vesting,
        rrPages: offer.rrPages,
        research: getEnv().research,
        diamond: getEnv().diamond,
        whale: getEnv().id,
        slug: offer.slug,
        d_open: null,
        d_close: null,
        alloTotal: null,
        alloRequired: null,
        alloMax: null
    }

    switch (ACL) {
        case 0: { //whale
            return getOfferDetailsWhale(offer, template)
        }
        case 2: { //injected
            return await getOfferDetailsPartnerInjected(offer, template, ADDRESS)
        }
        default: { //partners
           return getOfferDetailsPartner(offer, template)
        }
    }

}

function getOfferDetailsWhale (offer, template) {
    console.log("DETAILS whale", offer.id, offer.access)
    if(offer.access === 0 || offer.access === 1) {
        template.d_open = offer.d_open;
        template.d_close = offer.d_close;
        template.alloTotal = offer.alloTotal;
        template.alloRequired = offer.alloRequired;
        template.alloMax = offer.alloMax ? offer.alloMax : offer.alloTotal;
        return template;
    } else return false
}


function getOfferDetailsPartner (offer, template) {
    console.log("DETAILS partner", offer.id, offer.access)
    if(offer.access === 0 || offer.access === 2) {
        return fillPartnerData(offer, template)
    } else return false
}

async function getOfferDetailsPartnerInjected (offer, template, address) {
    console.log("DETAILS injected", offer.id, offer.access)
    const injectedUser = await getInjectedUser(address)
    console.log("DETAILS injected user", injectedUser)

    const isAssigned = injectedUser.offerAccess.find(el=> el === offer.id)
    console.log("DETAILS injected user isAssigned", isAssigned)

    if(isAssigned) {
        return fillPartnerData(offer, template)
    } else return false
}

function fillPartnerData (offer, template) {
    if(offer.accessPartnerDate && offer.accessPartnerDate > moment.utc()) {
        return false
    }
    template.d_open = offer.d_openPartner ? offer.d_openPartner : offer.d_open + Number(getEnv().partnerdelay)
    template.d_close = offer.d_closePartner ? offer.d_closePartner : offer.d_close + Number(getEnv().partnerdelay)
    template.alloTotal = offer.alloTotalPartner ? offer.alloTotalPartner : offer.alloTotal;
    template.alloRequired = offer.alloRequiredPartner>=0 ? offer.alloTotalPartner : offer.alloTotal;
    template.alloMax = offer.alloMaxPartner ? offer.alloMaxPartner : offer.b_alloMin * Number(getEnv().defaultpartnermulti);
    return template;
}

async function getOfferAllocation(session, req) {
    const {ACL} = checkAcl(session, req)
    const allocation = await getOfferAllocationData(Number(req.params.id))
    if(ACL === 0) {
        return {
            alloFilled: allocation.alloFilled + allocation.alloSide,
            alloRes: allocation.alloRes
        }
    } else {
        return {
            alloFilled: allocation.alloFilledPartner + allocation.alloSidePartner,
            alloRes: allocation.alloResPartner
        }
    }
}


module.exports = {getParamOfferDetails, getOfferAllocation}
