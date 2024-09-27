const { constructError } = require("../utils");
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

async function processReassign() {
    try {
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
