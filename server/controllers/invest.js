const moment = require('moment');
const {checkAcl} = require("./acl");
const crypto = require("crypto");
const {getOfferAllocation} = require("../queries/offer");
const {reserveAllocation} = require("../queries/invest");
const {addReservedTransaction, expireReservedTransaction} = require("../queries/participantLog");

let CACHE = {}

async function reserveExpire(session, req) {
    const {ACL, ADDRESS} = checkAcl(session, req)

    const ID = Number(req.query.id)
    const HASH = Number(req.query.hash)
    if (!CACHE[ID]?.date || CACHE[ID].date < moment().unix()) {
        const allocation = await getOfferAllocation(ID)
        CACHE[ID] = {...allocation._doc, ...{date: moment().unix() + 30 * 60}}
    }

    await expireReservedTransaction(ID, CACHE[ID].slug, ADDRESS, HASH)

    return {
        ok: true
    }
}

async function reserveSpot(session, req) {
    const {ACL, ADDRESS} = checkAcl(session, req)

    const ID = Number(req.query.id)
    if (!CACHE[ID]?.date || CACHE[ID].date < moment().unix()) {
        const allocation = await getOfferAllocation(ID)
        CACHE[ID] = {...allocation._doc, ...{date: moment().unix() + 30 * 60}}
    }

    const isSeparatePool = CACHE[ID].alloTotalPartner > 0 && ACL !== 0;
    const TOTAL_ALLOCATION = isSeparatePool ? CACHE[ID].alloTotalPartner : CACHE[ID].alloTotal;
    const AMOUNT = Number(req.query.amount) * (100 - CACHE[ID].b_tax) / 100
    const CURRENCY = req.query.currency

    if (!CURRENCY || CURRENCY.length > 5) return {
        ok: false,
        code: "BAD_CURRENCY"
    }

    const isReserved = await reserveAllocation(ID, AMOUNT, TOTAL_ALLOCATION, isSeparatePool)
    if (!isReserved) return {
        ok: false,
        code: "OVERALLOCATED",
    }

    const now = moment().unix()
    const hash = createHash(`${ADDRESS}` + `${now}`)
    await addReservedTransaction(ID, CACHE[ID].slug, ADDRESS, hash, AMOUNT, CURRENCY, ACL)

    return {
        ok: true,
        hash: hash,
        expires: now + 14*60 //15min validity
    }
}

const createHash = (data) => {
    return crypto.createHash("shake256", {outputLength: 3})
        .update(data)
        .digest("hex");
}

module.exports = {reserveSpot, reserveExpire}
