const moment = require('moment');
const {getOfferById} = require("../queries/offers.query");
const {getEnv} = require("../services/db");
const {bookAllocation, expireAllocation} = require("../queries/invest.query");
const {createHash} = require("./helpers");
const {ACLs} = require("../../src/lib/authHelpers");
const {fetchUpgrade} = require("../queries/upgrade.query");
const {PremiumItemsENUM, PremiumItemsParamENUM} = require("../../src/lib/enum/store");
const {BookingErrorsENUM} = require("../../src/lib/enum/invest");
const logger = require("../../src/lib/logger");

const {serializeError} = require("serialize-error");
const {isBased} = require("../../src/lib/utils");

let CACHE = {}

function checkReserveSpotQueryParams(req) {
    let _offerId, _amount, _currency, _chain;

    try {
        _offerId = Number(req.query.id)
        _amount = Number(req.query.amount)
        _currency = req.query.currency
        _chain = req.query.chain
    } catch (error) {
        logger.error('ERROR :: [checkReserveSpotQueryParams]', {error: serializeError(error), _offerId, _amount, _currency, _chain, params: req.query});
        return {
            ok: false,
            code: BookingErrorsENUM.VerificationFailed,
        }
    }

    return {
        ok: true,
        data: {
            _offerId, _amount, _currency, _chain
        }
    }
}

async function processReservation(queryParams, user) {
    const {ACL, multi, userId, allocationBonus} = user
    const { _offerId, _amount, _currency, _chain} = queryParams

    try {

        //cache allocation data
        if (!CACHE[_offerId]?.expire || CACHE[_offerId].expire < moment().unix()) {
            const allocation = await getOfferById(_offerId)
            CACHE[_offerId] = {...allocation, ...{expire: moment().unix() + 3 * 60}}
        }

        const isSeparatePool = CACHE[_offerId].alloTotalPartner > 0 && ACL !== ACLs.Whale;
        const currency = getEnv().currencies[_chain][_currency]

        //test if offer's ready
        const checkIsReadyForStart = checkInvestmentStateConditions(ACL, CACHE[_offerId])
        if(!checkIsReadyForStart.ok) return checkIsReadyForStart;
        if (!currency || !currency.isSettlement) return {
            ok: false,
            code: BookingErrorsENUM.BadCurrency
        }

        console.log("checks passed00")

        //generate hash
        const now = moment().unix()
        const expires = now + 15 * 60 //15min validity
        const hash = createHash(`${userId}` + `${now}`)

        //check allocation size
        const upgrades = await fetchUpgrade(userId, _offerId)
        const guaranteed = upgrades.find(el => el.storeId === PremiumItemsENUM.Guaranteed)
        const increased = upgrades.find(el => el.storeId === PremiumItemsENUM.Increased)

        const totalAllocation = CACHE[_offerId][isSeparatePool ? 'alloTotalPartner' : 'alloTotal']; //todo: whale
        const amount = _amount * (100 - CACHE[_offerId].tax) / 100
        console.log("checks passed0")

        const checkAllocationSize = checkAllocationConditions(
            CACHE[_offerId],
            totalAllocation,
            _amount,
            increased,
            ACL,
            multi,
            allocationBonus
        )
        if(!checkAllocationSize.ok) return checkAllocationSize;

        const isBooked = await bookAllocation(
            _offerId,
            isSeparatePool,
            totalAllocation,
            userId,
            hash,
            amount,
            guaranteed
        )

        if (!isBooked) {
            return {
                ok: false,
                code: BookingErrorsENUM.Overallocated,
            }
        }

        return {
            ok: true,
            data: {
                hash,
                expires
            }
        }
    } catch(error) {
        logger.error('ERROR :: [processReservation]', {error: serializeError(error), queryParams, user});
        return {
            ok: false,
            code: BookingErrorsENUM.ProcessingError,
        }
    }
}

function checkInvestmentStateConditions(ACL, offer) {
    if(offer.isPaused) return {
        ok: false,
        code: BookingErrorsENUM.IsPaused
    }

    const now = moment().unix()
    const startDate = (ACL !== ACLs.Whale && offer.d_openPartner > 0) ? offer.d_openPartner : offer.d_open

    if(now < startDate) return {
        ok: false,
        code: BookingErrorsENUM.NotOpen
    }

    return {
        ok: true,
        code: BookingErrorsENUM.Open
    }
}

function checkAllocationConditions(offer, totalAllocation, amountRequested, increased, acl, multi, allocationBonus) {

    let amountMax
    if(
        acl === ACLs.Whale ||
        offer.d_openPartner && offer.d_openPartner + 86400 < moment.utc()
    ) {
        amountMax = offer.alloTotal
    } else {
        if(isBased) {
            amountMax = multi * offer.alloMin + ((increased ? increased.amount : 0) * PremiumItemsParamENUM.Increased)
        } else {
            amountMax = (totalAllocation * multi) + allocationBonus + ((increased ? increased.amount : 0) * PremiumItemsParamENUM.Increased)
        }
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

async function reserveSpot(user, req) {
    try {
        const queryParams = checkReserveSpotQueryParams(req)
        if(!queryParams.ok) return queryParams

        const reservation = await processReservation(queryParams.data, user)
        if(!reservation.ok) return reservation

        return {
            ok: true,
            hash: reservation.data.hash,
            expires: reservation.data.expires
        }
    } catch(error) {
        logger.error(`ERROR :: [reserveSpot]`, {
            reqQuery: req.query, user, error: serializeError(error)
        });
    }

}

async function reserveExpire(user, req) {
    try {
        const {userId} = user
        const offerId = Number(req.query.id)

        if(req.query.hash?.length < 8) {
            await expireAllocation(offerId, userId, req.query.hash)
        } else {
            throw Error("Invalid expiry hash")
        }

        return {
            ok: true
        }
    } catch (e) {
        logger.error(`ERROR :: [reserveExpire]`, {
            reqQuery: req.query, user
        });
        return {
            ok: false
        }
    }

}

module.exports = {reserveSpot, reserveExpire}
