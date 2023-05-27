const moment = require('moment');
const {checkAcl} = require("./acl");
const {getEnv} = require("../services/db/utils");
const {getOfferList} = require("../queries/offers.query");
const {ACL: ACLs} = require("../../src/lib/acl");
const {getInjectedUserAccess} = require("../queries/injectedUser.query");

async function getParamOfferList(session, req) {
    const {ACL, ADDRESS} = checkAcl(session, req)

    console.log("LIST DATA session", session)
    console.log("LIST DATA req.query", req.query)
    console.log("LIST DATA acl", ACL)
    console.log("LIST DATA address", ADDRESS)

    const offers = await getOfferList()

    let response = {
        research: getEnv().research,
        offers: []
    }

    switch (ACL) {
        case ACLs.Whale: {
            response.offers = getOfferListWhale(offers)
            break;
        }
        case ACLs.PartnerInjected: {
            response.offers = offerListInjectedPartner(offers, ADDRESS);
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
    console.log("INJECTED - START")
    const user = await getInjectedUserAccess(address)
    console.log("INJECTED - user",user)

    if (!user || user.access.length===0) return false

    let allowedOffers = []
    for (let i = 0; i < user.access.length; i++) {
        const approved = offers.find(el => el.id === user.access[i])
        console.log("INJECTED - approved",approved)

        if (approved) allowedOffers.push(approved)
    }

    const list = offerListPartner(allowedOffers)
    console.log("INJECTED - list", list)
    console.log("INJECTED - END")
    return list


}

function offerListPartner(data) {
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
        image: offer.image,
        genre: offer.genre,
        slug: offer.slug,
        ticker: offer.ticker,
        d_open: offer.d_openPartner ? offer.d_openPartner : offer.d_open + Number(getEnv().partnerDelay),
        d_close: offer.d_closePartner ? offer.d_closePartner : offer.d_close + Number(getEnv().partnerDelay)

    }
}

function fillWhaleData(offer) {
    return {
        id: offer.id,
        name: offer.name,
        image: offer.image,
        genre: offer.genre,
        slug: offer.slug,
        ticker: offer.ticker,
        d_open: offer.d_open,
        d_close: offer.d_close,
    }
}

module.exports = {getParamOfferList}
