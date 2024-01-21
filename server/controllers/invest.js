const moment = require('moment');
const {getOfferWithLimits, getOfferById} = require("../queries/offers.query");
const {getEnv} = require("../services/db");
const {
    expireAllocation,
    investIncreaseAllocationReserved,
    investUpsertParticipantReservation, expireAllocationAll
} = require("../queries/invest.query");
const {createHash} = require("./helpers");
const {fetchUpgradeUsed} = require("../queries/upgrade.query");
const {PremiumItemsENUM} = require("../../src/lib/enum/store");
const {BookingErrorsENUM} = require("../../src/lib/enum/invest");
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");
const {sumAmountForUserAndTenant} = require("../queries/participants.query");
const {phases} = require("../../src/lib/phases");
const {userInvestmentState} = require("../../src/lib/investment");
const db = require("../services/db/definitions/db.init");

let CACHE = {}

async function processBooking(
    offer,
    offerLimit,
    user,
    amount,
) {
    const {userId, tenantId, partnerId} = user

    const {phaseCurrent} = phases(offerLimit)

    const [vault, upgrades] = await Promise.all([
        sumAmountForUserAndTenant(offer.id, userId, tenantId),
        fetchUpgradeUsed(userId, offer.id, tenantId)
    ]);

    const upgradeGuaranteed = upgrades.find(el => el.id === PremiumItemsENUM.Guaranteed)
    const upgradeIncreased = upgrades.find(el => el.id === PremiumItemsENUM.Increased)

    let transaction;

    try {
        transaction = await db.transaction();

        //increase reservation and ensure no overbooking
        const increaseReserved = await investIncreaseAllocationReserved(
            offer,
            amount,
            upgradeGuaranteed,
            transaction
        )

        if (!increaseReserved.ok) throw Error(BookingErrorsENUM.Overallocated)


        //generate hash
        const now = moment.utc().unix()
        const expires = now + 15 * 60 //15min validity
        const hash = createHash(`${userId}` + `${now}`)

        console.log("hash", hash)

        //upsert booking
        const upsertReservation = await investUpsertParticipantReservation(
            offer,
            userId,
            partnerId,
            tenantId,
            amount,
            hash,
            upgradeGuaranteed,
            transaction
        )
        if (!upsertReservation.ok) throw Error(BookingErrorsENUM.ProcessingError)


        //confirm enough allocation
        const userAllocation = userInvestmentState(
            user,
            {...offer, ...offerLimit},
            phaseCurrent,
            {
                guaranteedUsed: upgradeGuaranteed,
                increasedUsed: upgradeIncreased
            },
            vault.total,
            {
                alloRes: increaseReserved.data.alloRes,
                alloFilled: increaseReserved.data.alloFilled + increaseReserved.data.alloFilledInjected,
                alloGuaranteed: increaseReserved.data.alloGuaranteed + increaseReserved.data.alloGuaranteedInjected
            }
        )


        if (userAllocation.allocationUser_left < amount || userAllocation.offer_isProcessing) {
            throw Error(BookingErrorsENUM.Overallocated)
        }
        if (userAllocation.offer_isSettled) {
            throw Error(BookingErrorsENUM.NotOpen)
        }

        await transaction.commit();

        return {
            data: {
                expires,
                hash,
                amount,
                phase: phaseCurrent.phase
            },
            ok: true
        }
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        return {
            ok: false,
            code: error?.shortMessage ||serializeError(error).message
        }
    }
}


function checkInvestmentStateConditions(userId, tenantId, offer, offerLimit) {
    if (offer.isPaused) return {
        ok: false,
        code: BookingErrorsENUM.IsPaused
    }

    const now = moment.utc().unix()
    if (now < offerLimit.d_open || now > offerLimit.d_close) return {
        ok: false,
        code: BookingErrorsENUM.NotOpen
    }

    return {
        ok: true,
        code: BookingErrorsENUM.Open
    }
}


async function processReservation(queryParams, user) {
    const {userId, tenantId, partnerId} = user
    const {_offerId, _amount, _currency, _chain} = queryParams


    try {
        if (!CACHE[_offerId]?.expire || CACHE[_offerId].expire < moment.utc().unix()) {
            const allocation = await getOfferWithLimits(_offerId)
            CACHE[_offerId] = {...allocation, ...{expire: moment.utc().unix() + 3 * 60}}
        }

        const currency = getEnv().currencies[_chain][_currency]
        if (!currency || !currency.isSettlement || (currency.partnerId && currency.partnerId !== tenantId)) {
            return {
                ok: false,
                code: BookingErrorsENUM.BadCurrency
            }
        }

        const offerLimit = CACHE[_offerId].offerLimits.find(el => el.partnerId === partnerId) || CACHE[_offerId].offerLimits.find(el => el.partnerId === tenantId);

        //test if offer's ready
        const checkIsReadyForStart = checkInvestmentStateConditions(userId, tenantId, CACHE[_offerId], offerLimit)
        if (!checkIsReadyForStart.ok) return checkIsReadyForStart;


        //check conditions and book
        const isBooked = await processBooking(
            CACHE[_offerId],
            offerLimit,
            user,
            _amount,
        )
        if (!isBooked.ok) {
            return {
                ok: false,
                code: isBooked.code,
            }
        }

        return {
            ok: true,
            data: {
                ...isBooked.data
            }
        }

    } catch (error) {
        logger.error('ERROR :: [processReservation]', {error: serializeError(error), queryParams, user});
        return {
            ok: false,
            code: BookingErrorsENUM.ProcessingError,
        }
    }
}

function checkReserveSpotQueryParams(req) {
    let _offerId, _amount, _currency, _chain;

    try {
        _offerId = Number(req.query.id)
        _amount = Number(req.query.amount)
        _currency = req.query.currency
        _chain = req.query.chain

        if (_amount < 50) {
            throw Error("Amount too small")
        }

        return {
            ok: true,
            data: {
                _offerId,
                _amount,
                _currency,
                _chain,
            }
        }

    } catch (error) {
        logger.error('ERROR :: [checkReserveSpotQueryParams]', {
            error: serializeError(error),
            _offerId,
            _amount,
            _currency,
            _chain,
            params: req.query
        });
        return {
            ok: false,
            code: BookingErrorsENUM.VerificationFailed,
        }
    }
}

async function reserveSpot(user, req) {
    try {
        const queryParams = checkReserveSpotQueryParams(req)
        if (!queryParams.ok) return queryParams

        const reservation = await processReservation(queryParams.data, user)
        if (!reservation.ok) return reservation

        return {
            ok: true,
            hash: reservation.data.hash,
            expires: reservation.data.expires,
            amount: reservation.data.amount,
        }
    } catch (error) {
        logger.error(`ERROR :: [reserveSpot]`, {
            reqQuery: req.query, user, error: serializeError(error)
        });
        return { ok: false }
    }

}

async function reserveExpire(user, req) {
    try {
        const {userId} = user
        const offerId = Number(req.query.id)

        if (req.query.hash?.length < 8) {
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

async function reserveExpireAll(user, req) {
    try {
        const {userId, tenantId} = user
        const offerId = Number(req.query.id)

        const offer = await getOfferById(offerId)
        if(!offer.isSettled && !offer.alloRaised>0) {
            await expireAllocationAll(offerId, userId, tenantId)
        }

        return {
            ok: true
        }
    } catch (e) {
        logger.error(`ERROR :: [reserveExpireAll]`, {
            reqQuery: req.query, user
        });
        return {
            ok: false
        }
    }
}

module.exports = {reserveSpot, reserveExpire, reserveExpireAll}
