const moment = require("moment");
const { serializeError } = require("serialize-error");
const axios = require("axios");
const { getOfferWithLimits } = require("../queries/offers.query");
const { getEnv } = require("../services/env");
const {
    expireAllocation,
    investIncreaseAllocationReserved,
    investUpsertParticipantReservation,
} = require("../queries/invest.query");
const { fetchUpgradeUsed } = require("../queries/upgrade.query");
const { PremiumItemsENUM } = require("../../src/lib/enum/store");
const { BookingErrorsENUM } = require("../../src/lib/enum/invest");
const logger = require("../../src/lib/logger");
const { sumAmountForUserAndTenant } = require("../queries/participants.query");
const { phases } = require("../../src/lib/phases");
const { userInvestmentState } = require("../../src/lib/investment");
const db = require("../services/db/definitions/db.init");
const { authTokenName } = require("../../src/lib/authHelpers");
const { createHash } = require("./helpers");

let CACHE = {};

async function processBooking(offer, offerLimit, user, amount) {
    const { userId, tenantId, partnerId } = user;

    const { phaseCurrent } = phases({ ...offer, ...offerLimit });
    console.log("phaseCurrent", phaseCurrent);
    const [vault, upgrades] = await Promise.all([
        sumAmountForUserAndTenant(offer.id, userId, tenantId),
        fetchUpgradeUsed(userId, offer.id, tenantId),
    ]);
    // console.log("vault", vault);
    // console.log("upgrades", upgrades);
    // console.log("offer", offer);

    const upgradeGuaranteed = offer?.isLaunchpad
        ? { isExpired: true, alloMax: 0, alloUsed: 0 }
        : upgrades.find((el) => el.id === PremiumItemsENUM.Guaranteed);
    const upgradeIncreased = upgrades.find((el) => el.id === PremiumItemsENUM.Increased);

    let transaction;

    try {
        transaction = await db.transaction();

        //increase reservation and ensure no overbooking
        const increaseReserved = await investIncreaseAllocationReserved(offer, amount, upgradeGuaranteed, transaction);
        // console.log("increaseReserved", increaseReserved);

        if (!increaseReserved.ok) throw Error(BookingErrorsENUM.Overallocated);

        //generate hash
        const now = moment.utc().unix();
        const expires = now + 10 * 60; //15min validity
        // const expires = now + 15 * 60 //15min validity
        const hash = createHash(`${userId}` + `${now}`);

        console.log("hash", hash);

        //upsert booking
        const upsertReservation = await investUpsertParticipantReservation(
            offer,
            userId,
            partnerId,
            tenantId,
            amount,
            hash,
            upgradeGuaranteed,
            transaction,
        );
        if (!upsertReservation.ok || !(upsertReservation.data.hash?.length > 3))
            throw Error(BookingErrorsENUM.ProcessingError);

        //confirm enough allocation
        const userAllocation = userInvestmentState(
            user,
            { ...offer, ...offerLimit },
            phaseCurrent,
            {
                guaranteedUsed: upgradeGuaranteed,
                increasedUsed: upgradeIncreased,
            },
            vault.total,
            {
                alloRes: increaseReserved.data.alloRes,
                alloFilled: increaseReserved.data.alloFilled + increaseReserved.data.alloFilledInjected,
                alloGuaranteed: increaseReserved.data.alloGuaranteed + increaseReserved.data.alloGuaranteedInjected,
                alloRaised: increaseReserved.data.alloRaised,
                alloTotal: increaseReserved.data.alloTotal,
                isPaused: increaseReserved.data.isPaused,
                isSettled: increaseReserved.data.isSettled,
            },
        );

        if (userAllocation.allocationUser_left < amount || userAllocation.offer_isProcessing) {
            throw Error(BookingErrorsENUM.Overallocated);
        }
        if (userAllocation.allocationUser_min > amount) {
            throw Error(BookingErrorsENUM.AmountTooLow);
        }
        if (userAllocation.offer_isSettled) {
            throw Error(BookingErrorsENUM.NotOpen);
        }

        await transaction.commit();

        return {
            data: {
                expires,
                hash: upsertReservation.data.hash,
                amount,
                phase: phaseCurrent.phase,
            },
            ok: true,
        };
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        return {
            ok: false,
            code: error?.shortMessage || serializeError(error).message,
        };
    }
}

function checkInvestmentStateConditions(userId, tenantId, offer, offerLimit) {
    if (offer.isPaused)
        return {
            ok: false,
            code: BookingErrorsENUM.IsPaused,
        };

    const now = moment.utc().unix();
    if (now < offerLimit.d_open || now > offerLimit.d_close)
        return {
            ok: false,
            code: BookingErrorsENUM.NotOpen,
        };

    return {
        ok: true,
        code: BookingErrorsENUM.Open,
    };
}

async function processReservation(queryParams, user) {
    const { userId, tenantId, partnerId } = user;
    const { _offerId, _amount, _currency, _chain } = queryParams;

    try {
        if (!CACHE[_offerId]?.expire || CACHE[_offerId].expire < moment.utc().unix()) {
            const allocation = await getOfferWithLimits(_offerId);
            CACHE[_offerId] = {
                ...allocation,
                ...{ expire: moment.utc().unix() + 3 * 60 },
            };
        }

        const currency = getEnv().currencies[_chain][_currency];
        if (!currency || !currency.isSettlement || (currency.partnerId && currency.partnerId !== tenantId)) {
            return {
                ok: false,
                code: BookingErrorsENUM.BadCurrency,
            };
        }

        const offerLimit =
            CACHE[_offerId].offerLimits.find((el) => el.partnerId === tenantId) ||
            CACHE[_offerId].offerLimits.find((el) => el.partnerId === partnerId && !el.isTenantExclusive);
        if (!offerLimit) throw Error("No offer limit condition");

        //test if offer's ready
        const checkIsReadyForStart = checkInvestmentStateConditions(userId, tenantId, CACHE[_offerId], offerLimit);

        if (!checkIsReadyForStart.ok) return checkIsReadyForStart;

        //check conditions and book
        const isBooked = await processBooking(CACHE[_offerId], offerLimit, user, _amount);

        if (!isBooked.ok) {
            return {
                ok: false,
                code: isBooked.code,
            };
        }

        return {
            ok: true,
            data: {
                ...isBooked.data,
            },
        };
    } catch (error) {
        logger.error("ERROR :: [processReservation]", {
            error: serializeError(error),
            queryParams,
            user,
        });
        return {
            ok: false,
            code: BookingErrorsENUM.ProcessingError,
        };
    }
}

function checkReserveSpotQueryParams(req) {
    let _offerId, _amount, _currency, _chain;

    try {
        _offerId = Number(req.query.id);
        _amount = Number(req.query.amount);
        _currency = req.query.currency;
        _chain = req.query.chain;

        if (_offerId < 1) {
            throw Error("Offer ID not valid");
        }

        return {
            ok: true,
            data: {
                _offerId,
                _amount,
                _currency,
                _chain,
            },
        };
    } catch (error) {
        logger.error("ERROR :: [checkReserveSpotQueryParams]", {
            error: serializeError(error),
            _offerId,
            _amount,
            _currency,
            _chain,
            params: req.query,
        });
        return {
            ok: false,
            code: BookingErrorsENUM.VerificationFailed,
        };
    }
}

async function obtainSignature(offerId, amount, hash, expires, token) {
    const signature = await axios.post(
        `${process.env.AUTHER}/invest/sign`,
        {
            offerId,
            amount,
            hash,
            expires,
            token,
        },
        {
            headers: {
                "content-type": "application/json",
            },
        },
    );
    if (!signature?.data?.ok) {
        return {
            ok: false,
            code: BookingErrorsENUM.BAD_SIGNATURE,
        };
    }

    return {
        ok: true,
        data: signature.data.data,
    };
}

async function reserveSpot(user, req) {
    try {
        const queryParams = checkReserveSpotQueryParams(req);
        if (!queryParams.ok) return queryParams;

        console.log("queryParams", queryParams);
        const reservation = await processReservation(queryParams.data, user);
        console.log("reservation", reservation);

        if (!reservation.ok) return reservation;

        console.log("reservation", reservation);
        const token = req.cookies[authTokenName];
        const signature = await obtainSignature(
            queryParams.data._offerId,
            reservation.data.amount,
            reservation.data.hash,
            reservation.data.expires,
            token,
        );

        if (!signature.ok) {
            console.log("expore", queryParams.data._offerId, user.userId, reservation.data.hash);
            await expireAllocation(queryParams.data._offerId, user.userId, reservation.data.hash);
            return signature;
        }

        return {
            ok: true,
            hash: reservation.data.hash,
            expires: reservation.data.expires,
            amount: reservation.data.amount,
            signature: signature.data,
        };
    } catch (error) {
        logger.error(`ERROR :: [reserveSpot]`, {
            reqQuery: req.query,
            user,
            error: serializeError(error),
        });
        return { ok: false };
    }
}

module.exports = { reserveSpot };
