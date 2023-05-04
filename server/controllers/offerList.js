const moment = require( 'moment' );
const {checkAcl} = require("./acl");
const {getEnv} = require("../services/db/utils");
const {getOfferList} = require("../queries/offers.query");

async function getParamOfferList (session, req) {
    const {ACL, ADDRESS} = checkAcl(session, req)

    console.log("LIST DATA session", session)
    console.log("LIST DATA req.query", req.query)
    console.log("LIST DATA acl", ACL)
    console.log("LIST DATA address", ADDRESS)

    const offers =  await getOfferList()

    switch (ACL) {
        case 0: {
            return getOfferListWhale(offers)
        }
        default: {
            return offerListPartner(offers)
        }
    }
}

function getOfferListWhale (offers) {
    let offerList = []
    offers.forEach(el=> {
        offerList.push(fillWhaleData(el))
    })
    console.log("offer list", offerList)
    return offerList
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
