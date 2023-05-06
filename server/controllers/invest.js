const moment = require('moment');
const {checkAcl} = require("./acl");
const crypto = require("crypto");
const {getOfferReservedData} = require("../queries/offers.query");
const {getEnv} = require("../services/db/utils");
const {bookAllocation, expireAllocation} = require("../queries/invest.query");

let CACHE = {}

async function reserveExpire(session, req) {
    const {ADDRESS} = checkAcl(session, req)

    const ID = Number(req.query.id)
    if(req.query.hash?.length < 8) {
        await expireAllocation(ID, ADDRESS, req.query.hash)
    }

    return {
        ok: true
    }
}


async function reserveSpot(session, req) {
    const {ACL, ADDRESS, USER} = checkAcl(session, req)
    const offerId = Number(req.query.id)
    if (!CACHE[offerId]?.expire || CACHE[offerId].expire < moment().unix()) {
        const allocation = await getOfferReservedData(offerId)
        CACHE[offerId] = {...allocation, ...{expire: moment().unix() + 3 * 60}}
    }

    const isSeparatePool = CACHE[offerId].alloTotalPartner > 0 && ACL !== 0;
    const TOTAL_ALLOCATION = isSeparatePool ? CACHE[offerId].alloTotalPartner : CACHE[offerId].alloTotal;
    const AMOUNT = Number(req.query.amount) * (100 - CACHE[offerId].tax) / 100
    const CURRENCY = getEnv().currencies[req.query.chain][req.query.currency]
    const checkIsReadyForStart = isReadyForInvestment(ACL, isSeparatePool, CACHE[offerId])
    if(!checkIsReadyForStart.ok) return checkIsReadyForStart;

    if (!CURRENCY || !CURRENCY.isSettlement) return {
        ok: false,
        code: "BAD_CURRENCY"
    }

    const now = moment().unix()
    const expire = now + 15 * 60 //15min validity
    const hash = createHash(`${ADDRESS}` + `${now}`)
    const isBooked = await bookAllocation(offerId, isSeparatePool, TOTAL_ALLOCATION, ADDRESS, hash, AMOUNT, ACL, USER.id)

    if (!isBooked) {
        return {
            ok: false,
            code: "OVERALLOCATED",
        }
    }

    return {
        ok: true,
        hash: hash,
        expires: expire
    }
}

function isReadyForInvestment(ACL, isSeparatePool, offer) {
    if(offer.isPaused) return {
        ok: false,
        code: "IS_PAUSED"
    }

    const now = moment().unix()
    if(offer.d_openPartner > 0) {
        if(ACL === 0) {
            if(now < offer.d_open) return {
                ok: false,
                code: "NOT_OPEN"
            }
        } else {
            if(now < offer.d_openPartner) return {
                ok: false,
                code: "NOT_OPEN"
            }
        }
    } else {
        if(now < offer.d_open) return {
            ok: false,
            code: "NOT_OPEN"
        }
    }

    return {
        ok: true,
        code: "OPEN"
    }
}


const createHash = (data) => {
    return crypto.createHash("shake256", {outputLength: 3})
        .update(data)
        .digest("hex");
}

module.exports = {reserveSpot, reserveExpire}
