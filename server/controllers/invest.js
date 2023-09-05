const moment = require('moment');
const {getOfferById} = require("../queries/offers.query");
const {getEnv} = require("../services/db");
const {bookAllocation, expireAllocation} = require("../queries/invest.query");
const {createHash} = require("./helpers");
const {ACLs} = require("../../src/lib/authHelpers");
const {fetchUpgrade} = require("../queries/upgrade.query");
const {PremiumItemsENUM, PremiumItemsParamENUM} = require("../../src/lib/premiumHelper");

let CACHE = {}

const BookingErrorsENUM = {
    VerificationFailed: "VERIFICATION_FAILED",
    BadCurrency: "BAD_CURRENCY",
    Overallocated: "OVERALLOCATED",
    IsPaused: "IS_PAUSED",
    NotOpen: "NOT_OPEN",
    AllocationTooHigh: "ALLOCATION_TOO_HIGH",
    Open: "OPEN"
}

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
    const {ACL, address, id, multi} = user
    let _offerId, _amount, _currency, _chain;

    try {
        _offerId = Number(req.query.id)
        _amount = Number(req.query.amount)
        _currency = req.query.currency
        _chain = req.query.chain
    } catch (e) {
        return {
            ok: false,
            code: BookingErrorsENUM.VerificationFailed, //todo: implement on frontend
        }
    }

    //cache allocation data
    if (!CACHE[_offerId]?.expire || CACHE[_offerId].expire < moment().unix()) {
        const allocation = await getOfferById(_offerId)
        CACHE[_offerId] = {...allocation, ...{expire: moment().unix() + 3 * 60}}
    }

    const isSeparatePool = CACHE[_offerId].alloTotalPartner > 0 && ACL !== ACLs.Whale;
    const currency = getEnv().currencies[_chain][_currency]

    //test if offer's ready
    const checkIsReadyForStart = checkInvestmentConditions(ACL, isSeparatePool, CACHE[_offerId], currency)
    if(!checkIsReadyForStart.ok) return checkIsReadyForStart;
    if (!currency || !currency.isSettlement) return {
        ok: false,
        code: BookingErrorsENUM.BadCurrency
    }

    //generate hash
    const now = moment().unix()
    const expire = now + 15 * 60 //15min validity
    const hash = createHash(`${address}` + `${now}`)

    //check allocation size
    const upgrades = await fetchUpgrade(address, _offerId) //todo: possible race condition
    const guaranteed = upgrades.find(el => el.storeId === PremiumItemsENUM.Guaranteed)
    const increased = upgrades.find(el => el.storeId === PremiumItemsENUM.Increased)

    const totalAllocation = isSeparatePool ? CACHE[_offerId].alloTotalPartner : CACHE[_offerId].alloTotal;
    const amount = _amount * (100 - CACHE[_offerId].tax) / 100

    const checkAllocationSize = checkAllocationConditions(_amount, ACL, multi, guaranteed, increased, CACHE[_offerId], isSeparatePool)
    if(!checkAllocationSize.ok) return checkAllocationSize;

    const isBooked = await bookAllocation(_offerId, isSeparatePool, totalAllocation, address, hash, amount, ACL, id, guaranteed)

    if (!isBooked) {
        return {
            ok: false,
            code: BookingErrorsENUM.Overallocated,
        }
    }

    return {
        ok: true,
        hash: hash,
        expires: expire
    }
}

function checkInvestmentConditions(ACL, isSeparatePool, offer) {
    if(offer.isPaused) return {
        ok: false,
        code: BookingErrorsENUM.IsPaused
    }

    const now = moment().unix()
    if(offer.d_openPartner > 0) {
        if(ACL === 0) {
            if(now < offer.d_open) return {
                ok: false,
                code: BookingErrorsENUM.NotOpen
            }
        } else {
            if(now < offer.d_openPartner) return {
                ok: false,
                code: BookingErrorsENUM.NotOpen
            }
        }
    } else {
        if(now < offer.d_open) return {
            ok: false,
            code: BookingErrorsENUM.NotOpen
        }
    }

    return {
        ok: true,
        code: BookingErrorsENUM.Open
    }
}

function checkAllocationConditions(amountRequested, acl, multi, guaranteed, increased, offer) {
    let amountMax
    if(
        acl === ACLs.Whale ||
        offer.d_openPartner && offer.d_openPartner + 86400 < moment.utc()
    ) {
        amountMax = offer.alloTotal
    } else {
        amountMax = multi * offer.alloMin + ((increased ? increased.amount : 0) * PremiumItemsParamENUM.Increased)
    }

    if(amountRequested <= amountMax) {
        return {
            ok: true
        }
    } else return {
        ok: false,
        code: BookingErrorsENUM.AllocationTooHigh
    }
}


module.exports = {reserveSpot, reserveExpire}
