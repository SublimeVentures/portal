const moment = require('moment');
const {getEnv} = require("../services/db");
const {getOfferList} = require("../queries/offers.query");
const {OfferAccess, ACLs, OfferAccessACL} = require("../../src/lib/authHelpers");
const {getInjectedUserAccess} = require("../queries/injectedUser.query");


async function getPermittedOfferList(user) {
    const {ACL, address} = user
    const offers = await getOfferList()

    switch (ACL) {
        case ACLs.Whale: {
            return getOfferListWhale(offers, ACL)
        }
        case ACLs.Member: {
            return getOfferListMember(offers, ACL)
        }
        case ACLs.NeoTokyo: {
            return offerListNeoTokyo(offers, ACL);
        }
        case ACLs.PartnerInjected: {
            return await offerListInjectedPartner(offers, address);
        }
        case ACLs.Admin: {
            return offerListAdmin(offers, ACL);
        }
        default: {
            return  offerListPartner(offers, ACL)
        }
    }

}
async function getParamOfferList(user) {
    return {
        cdn: getEnv().cdn,
        stats: getEnv().stats,
        offers: await getPermittedOfferList(user)
    }
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
                if (el.accessPartnerDate < moment.utc().unix()) {
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
                if (el.accessPartnerDate < moment.utc().unix()) {
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
                if (el.accessPartnerDate < moment.utc().unix()) {
                    offerList.push(fillPartnerData(el))
                }
            }
    })
    return offerList.sort((a, b) => b.id - a.id);
}

function offerListPartner(data, acl) {
    let offerList = []
    data.forEach(el => {
        if(OfferAccessACL[acl][el.access]) {
            if (!el.accessPartnerDate) offerList.push(fillPartnerData(el))
            else {
                if (el.accessPartnerDate < moment.utc().unix()) {
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
        market: offer.otc,
        name: offer.name,
        genre: offer.genre,
        slug: offer.slug,
        ticker: offer.ticker,
        accelerator: offer.isCitCapX,
        isSettled: offer.isSettled,
        d_open: offer.d_openPartner,
        d_close: offer.d_closePartner
    }
}

function fillWhaleData(offer) {
    return {
        id: offer.id,
        market: offer.otc,
        name: offer.name,
        genre: offer.genre,
        slug: offer.slug,
        ticker: offer.ticker,
        accelerator: offer.isCitCapX,
        d_open: offer.d_open,
        d_close: offer.d_close,
    }
}

module.exports = {getParamOfferList, getPermittedOfferList, OfferAccess}
