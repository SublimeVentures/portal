const moment = require("moment/moment");
const { constructError } = require("../utils");
const { getEnv } = require("../services/env");
const { BookingErrorsENUM } = require("@/lib/enum/invest");

function checkReassignQueryParams(req) {
    let _offerId, _currency, _chain, _to;

    try {
        _offerId = Number(req.query.id);
        _currency = req.query.currency;
        _chain = req.query.chain;
        _to = req.query.to;

        if (_offerId < 1) {
            throw Error("Offer ID not valid");
        }

        return {
            ok: true,
            data: {
                _offerId,
                _currency,
                _chain,
                _to,
            },
        };
    } catch (error) {
        return {
            ok: false,
            code: BookingErrorsENUM.VerificationFailed,
            error: constructError("QUERY", error, {
                isLog: true,
                enableSentry: false,
                methodName: "checkReassignQueryParams",
            }),
        };
    }
}

async function processReassign(queryParams, user) {
    try {
        // const { userId, tenantId, partnerId } = user;
        const { _offerId, _to, _currency, _chain } = queryParams;

        const expire = moment.utc().unix() + 3 * 60;

        const currency = getEnv().currencies[_chain][_currency];

        return {
            ok: true,
            reassign: {
                _currency: currency,
                _expire: expire,
                _offer: _offerId,
                _to,
            },
        };
    } catch (error) {
        return {
            ok: false,
            code: BookingErrorsENUM.VerificationFailed,
            error: constructError("QUERY", error, {
                isLog: true,
                methodName: "processReassign",
            }),
        };
    }
}

module.exports = { checkReassignQueryParams, processReassign };
