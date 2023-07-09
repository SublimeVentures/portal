const moment = require('moment');
const {getEnv} = require("../services/db");
const {getOfferList} = require("../queries/offers.query");
const { ACLs} = require("../../src/lib/authHelpers");
const {getInjectedUserAccess} = require("../queries/injectedUser.query");

const OfferAccess = {
    Whales: 0,
    Everyone: 1,
    NeoTokyo: 2,
}

async function getParamOfferList(user) {
    const {ACL, address} = user
    const offers = await getOfferList()

    let response = {
        cdn: getEnv().cdn,
        stats: getEnv().stats,
        offers: []
    }

    switch (ACL) {
        case ACLs.Whale: {
            response.offers = getOfferListWhale(offers)
            break;
        }
        case ACLs.NeoTokyo: {
            response.offers = offerListNeoTokyo(offers);
            break;
        }
        case ACLs.PartnerInjected: {
            response.offers = await offerListInjectedPartner(offers, address);
            break;
        }
        default: {
            response.offers =  offerListPartner(offers)
            break;
        }
    }

    return response
}

function getOfferListWhale(offers) {
    let offerList = []
    offers.forEach(el => {
        offerList.push(fillWhaleData(el))
    })
    return offerList
}

async function offerListInjectedPartner(offers, address) {
    const user = await getInjectedUserAccess(address)
    if (!user || user.access.length===0) return false
    let allowedOffers = []
    for (let i = 0; i < user.access.length; i++) {
        const approved = offers.find(el => el.id === user.access[i])
        if (approved) allowedOffers.push(approved)
    }

    return offerListPartner(allowedOffers)
}

function offerListPartner(data) {
    let offerList = []
    data.forEach(el => {
        if(el.access !== OfferAccess.NeoTokyo) {
            if (!el.accessPartnerDate) offerList.push(fillPartnerData(el))
            else {
                if (el.accessPartnerDate < moment.utc()) {
                    offerList.push(fillPartnerData(el))
                }
            }
        }
    })
    return offerList
}

function offerListNeoTokyo(data) {
    let offerList = []
    data.forEach(el => {
        if (!el.accessPartnerDate) offerList.push(fillPartnerData(el))
        else {
            if (el.accessPartnerDate < moment.utc()) {
                offerList.push(fillPartnerData(el))
            }
        }
    })
    return offerList
}


function fillPartnerData(offer) {
    return {
        id: offer.id,
        name: offer.name,
        genre: offer.genre,
        slug: offer.slug,
        ticker: offer.ticker,
        accelerator: offer.isCitCapX,
        d_open: offer.d_openPartner ? offer.d_openPartner : offer.d_open + Number(getEnv().partnerDelay),
        d_close: offer.d_closePartner ? offer.d_closePartner : offer.d_close + Number(getEnv().partnerDelay)

    }
}

function fillWhaleData(offer) {
    return {
        id: offer.id,
        name: offer.name,
        genre: offer.genre,
        slug: offer.slug,
        ticker: offer.ticker,
        accelerator: offer.isCitCapX,
        d_open: offer.d_open,
        d_close: offer.d_close,
    }
}

module.exports = {getParamOfferList, OfferAccess}
