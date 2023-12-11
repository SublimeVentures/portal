const moment = require('moment');
const {getOfferById} = require("../queries/offers.query");
const {getEnv} = require("../services/db");
const {bookAllocation, expireAllocation} = require("../queries/invest.query");
const {createHash} = require("./helpers");
const {ACLs} = require("../../src/lib/authHelpers");
const {fetchUpgrade} = require("../queries/upgrade.query");
const {PremiumItemsENUM} = require("../../src/lib/enum/store");
const {BookingErrorsENUM} = require("../../src/lib/enum/invest");
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");
const {getUserAllocationMax} = require("../../src/lib/investment");
const {PhaseId} = require("../../src/lib/phases");

let CACHE = {}

function checkReserveSpotQueryParams(req) {
    let _offerId, _amount, _currency, _chain;

    try {
        _offerId = Number(req.query.id)
        _amount = Number(req.query.amount)
        _currency = req.query.currency
        _chain = req.query.chain

        if(_amount<50) {
            throw Error("Amount too small")
        }

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
    const {ACL, userId} = user
    const { _offerId, _amount, _currency, _chain} = queryParams

    try {
        //cache allocation data
        if (!CACHE[_offerId]?.expire || CACHE[_offerId].expire < moment.utc().unix()) {
            const allocation = await getOfferById(_offerId)
            CACHE[_offerId] = {...allocation, ...{expire: moment.utc().unix() + 3 * 60}}
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


        //generate hash
        const now = moment.utc().unix()
        const expires = now + 15 * 60 //15min validity
        const hash = createHash(`${userId}` + `${now}`)

        //check allocation size
        const upgrades = await fetchUpgrade(userId, _offerId)
        const guaranteed = upgrades.find(el => el.storeId === PremiumItemsENUM.Guaranteed)
        const increased = upgrades.find(el => el.storeId === PremiumItemsENUM.Increased)

        const totalAllocation = CACHE[_offerId][isSeparatePool ? 'alloTotalPartner' : 'alloTotal']; //todo: whale
        const amount = Number(_amount)

        const checkAllocationSize = checkAllocationConditions(
            CACHE[_offerId],
            totalAllocation,
            _amount,
            increased,
            user
        )
        if(!checkAllocationSize.ok) return checkAllocationSize;

        const isBooked = await bookAllocation(
            _offerId,
            isSeparatePool,
            totalAllocation,
            userId,
            hash,
            amount,
            guaranteed,
            checkAllocationSize.phase
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
                expires,
                amount
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

    const now =  moment.utc().unix()
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

function checkAllocationConditions(offer, totalAllocation, amountRequested, increased, account) {
    let amountMax
    let phase
    if(
        account.acl === ACLs.Whale || //whales have always full allo
        account.acl === ACLs.Member && offer.d_open && offer.d_open + 86400 < moment.utc().unix() ||
        offer.d_openPartner && offer.d_openPartner + 86400 < moment.utc().unix()
    ) {
        amountMax = offer.alloTotal
        phase = PhaseId.Unlimited
    } else {
        const {allocationUser_max}  = getUserAllocationMax(account, offer, increased?.amount)
        amountMax = allocationUser_max
        phase = PhaseId.FCFS
    }
    //todo: check allocation guaranteed + currently filled

    if(amountRequested <= amountMax) {
        return {
            ok: true,
            phase
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
            expires: reservation.data.expires,
            amount: reservation.data.amount,
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
