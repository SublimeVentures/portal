const axios = require("axios");
const { serializeError } = require("serialize-error");
const { expireAllocation } = require("../queries/invest.query");
const { checkReassignQueryParams } = require("../queries/reassign.query");
const { BookingErrorsENUM } = require("@/lib/enum/invest");
const { authTokenName } = require("@/lib/authHelpers");
const logger = require("@/lib/logger");

async function obtainSignature(offerId, expires, chainId, token) {
    const signature = await axios.post(
        `${process.env.AUTHER}/reassign/sign`,
        {
            offerId,
            expires,
            chainId,
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

async function reassign(user, req) {
    try {
        const queryParams = checkReassignQueryParams(req);
        if (!queryParams.ok) return queryParams;

        const reservation = await processReservation(queryParams.data, user);
        if (!reservation.ok) return reservation;

        const token = req.cookies[authTokenName];

        const signature = await obtainSignature(
            queryParams.data._offerId,
            reservation.data.amount,
            reservation.data.hash,
            reservation.data.expires,
            user.partnerId,
            queryParams.data._chain,
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

module.exports = { reassign };
