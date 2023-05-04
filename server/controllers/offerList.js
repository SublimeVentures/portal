const moment = require( 'moment' );
const {getInjectedUser} = require("../queries/injectedUser.query");
const {getOfferList} = require("../queries/offer");
const {checkAcl} = require("./acl");
const {getEnv} = require("../services/mongo");

async function getParamOfferList (session, req) {
    const {ACL, ADDRESS} = checkAcl(session, req)

    console.log("LIST DATA session", session)
    console.log("LIST DATA req.query", req.query)
    console.log("LIST DATA acl", ACL)
    console.log("LIST DATA address", ADDRESS)


    switch (ACL) {
        case 0: { //whale
            return await getOfferListWhale()
        }
        case 2: { //injected
            return await getOfferListPartnerInjected(ADDRESS)
        }
        default: { //partners
            return await getOfferListPartner()
        }
    }
}

async function getOfferListWhale () {
    const filter = {
        access: {
            $in: [0,1]
        }
    }
    console.log("LIST OFFERS for WHALE - filter", filter)
    const data =  await getOfferList(filter)
    console.log("data whale", data)
    let offerList = []
    data.forEach(el=> {
        offerList.push(fillWhaleData(el))
    })
    console.log("offer list", offerList)
    return offerList
}

async function getOfferListPartner () {
    const filter = {
        access: {
            $in: [0,2]
        }
    }
    const data = await getOfferList(filter)
    console.log("LIST OFFERS for PARTNER USER", filter)
    return offerListPartner(data)
}

async function getOfferListPartnerInjected (address) {
    const injectedUser = await getInjectedUser(address)
    console.log("LIST OFFERS for INJECTED USER", address)
    console.log("LIST OFFERS for INJECTED USER - injectedUser", injectedUser)
    const filter = {
        id: {
            $in: injectedUser.accesss
        }
    }
    console.log("LIST OFFERS for INJECTED USER - filter", filter)
    const data = await getOfferList(filter)

    return offerListPartner(data)
}


function offerListPartner(data) {
    let offerList = []
    data.forEach(el => {
        if(!el.accessPartnerDate) offerList.push(fillPartnerData(el))
        else {
            if(el.accessPartnerDate < moment.utc()) {
                offerList.push(fillPartnerData(el))
            }
        }
    })

    return offerList
}


function fillPartnerData (offer) {
    return {
        name:offer.name,
        image:offer.image,
        genre:offer.genre,
        slug:offer.slug,
        d_open: offer.d_openPartner ? offer.d_openPartner : offer.d_open + Number(getEnv().partnerDelay),
        d_close: offer.d_closePartner ? offer.d_closePartner : offer.d_close + Number(getEnv().partnerDelay)
    }
}

function fillWhaleData (offer) {
    return {
        name:offer.name,
        image:offer.image,
        genre:offer.genre,
        slug:offer.slug,
        d_open: offer.d_open,
        d_close: offer.d_close
    }
}

module.exports = {getParamOfferList}
