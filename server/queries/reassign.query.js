const moment = require("moment/moment");
const axios = require("axios");
const { constructError } = require("../utils");
const { getEnv } = require("../services/env");
const { ReassignErrorsENUM } = require("../../src/lib/enum/reassign");

function checkReassignQueryParams(req) {
    let _offerId, _currency, _chain, _to, _sender;

    try {
        _offerId = Number(req.query.id);
        _currency = req.query.currency;
        _chain = req.query.chain;
        _to = req.query.to;
        _sender = req.query.sender;

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
                _sender,
            },
        };
    } catch (error) {
        return {
            ok: false,
            code: ReassignErrorsENUM.VerificationFailed,
            error: constructError("QUERY", error, {
                isLog: true,
                enableSentry: false,
                methodName: "checkReassignQueryParams",
            }),
        };
    }
}

async function obtainReassignSignature(to, currency, offerId, expire, _sender, token) {
    const signature = await axios.post(
        `${process.env.AUTHER}/reassign/sign`,
        {
            _to: to,
            _currency: currency,
            _offer: offerId,
            _expire: expire,
            _sender,
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
            code: ReassignErrorsENUM.BAD_SIGNATURE,
        };
    }

    return {
        ok: true,
        data: signature.data.data,
    };
}

async function processReassign(queryParams, token) {
    try {
        // const { userId, tenantId, partnerId } = user;
        const { _offerId, _to, _currency, _chain, _sender } = queryParams;

        const expire = moment.utc().unix() + 3 * 60;

        const currency = getEnv().currencies[_chain][_currency];

        const signature = await obtainReassignSignature(_to, _currency, _offerId, expire, _sender, token);

        if (!signature.ok) {
            return signature;
        }

        return {
            ok: true,
            reassign: {
                _currency: currency,
                _expire: expire,
                _offer: _offerId,
                _sender,
                _to,
            },
            signature,
        };
    } catch (error) {
        return {
            ok: false,
            code: ReassignErrorsENUM.VerificationFailed,
            error: constructError("QUERY", error, {
                isLog: true,
                methodName: "processReassign",
            }),
        };
    }
}

module.exports = { checkReassignQueryParams, processReassign };
