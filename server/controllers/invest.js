const moment = require('moment');
const {getOfferReservedData} = require("../queries/offers.query");
const {getEnv} = require("../services/db");
const {bookAllocation, expireAllocation} = require("../queries/invest.query");
const {createHash} = require("./helpers");

let CACHE = {}

async function reserveExpire(user, req) {
    const {address} = user

    const ID = Number(req.query.id)
    if(req.query.hash?.length < 8) {
        await expireAllocation(ID, address, req.query.hash)
    }

    return {
        ok: true
    }
}

async function reserveSpot(user, req) {
    const {ACL, address, id} = user
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
    const hash = createHash(`${address}` + `${now}`)
    const isBooked = await bookAllocation(offerId, isSeparatePool, TOTAL_ALLOCATION, address, hash, AMOUNT, ACL, id)

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




module.exports = {reserveSpot, reserveExpire}
