const moment = require('moment');
const {getEnv} = require("../services/db");
const {getOfferList} = require("../queries/offers.query");
const {OfferAccess, ACLs, OfferAccessACL} = require("../../src/lib/authHelpers");
const {getInjectedUserAccess} = require("../queries/injectedUser.query");


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
            response.offers = getOfferListWhale(offers, ACL)
            break;
        }
        case ACLs.Member: {
            response.offers = getOfferListMember(offers, ACL)
            break;
        }
        case ACLs.NeoTokyo: {
            response.offers = offerListNeoTokyo(offers, ACL);
            break;
        }
        case ACLs.PartnerInjected: {
            response.offers = await offerListInjectedPartner(offers, address);
            break;
        }
        case ACLs.Admin: {
            response.offers = offerListAdmin(offers, ACL);
            break;
        }
        default: {
            response.offers =  offerListPartner(offers, ACL)
            break;
        }
    }

    return response
}

function getOfferListWhale(offers, acl) {
    let offerList = []

    offers.forEach(el => {
        if(OfferAccessACL[acl][el.access]) {
            offerList.push(fillWhaleData(el))
        }
    })
    return offerList
}

function getOfferListMember(offers, acl) {
    let offerList = []
    offers.forEach(el => {
        if(OfferAccessACL[acl][el.access]) {
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

function offerListNeoTokyo(offers, acl) {
    let offerList = []
    offers.forEach(el => {
        if(OfferAccessACL[acl][el.access]) {
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




async function offerListInjectedPartner(offers, address) {
    const user = await getInjectedUserAccess(address)
    if (!user || user.access.length===0) return false
    let allowedOffers = []
    for (let i = 0; i < user.access.length; i++) {
        const approved = offers.find(el => el.id === user.access[i])
        if (approved) allowedOffers.push(approved)
    }

    return offerListInjectedProcess(allowedOffers)
}

function offerListInjectedProcess(data) {
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

function offerListPartner(data, acl) {
    let offerList = []
    data.forEach(el => {
        if(OfferAccessACL[acl][el.access]) {
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

function offerListAdmin(data, acl) {
    let offerList = []
    data.forEach(el => {
        if(OfferAccessACL[acl][el.access]) {
            offerList.push(fillPartnerData(el))
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
        d_open: offer.d_openPartner,
        d_close: offer.d_closePartner
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
