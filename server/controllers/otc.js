const {getEnv} = require("../services/db");
const {getActiveOffers, getHistoryOffers, saveOtcHash, signOtcTransaction} = require("../queries/otc.query");
const {getPermittedOfferList} = require("./offerList");
const moment = require("moment");
const {createHash} = require("./helpers");
const {signData} = require("../../src/lib/authHelpers");
const Sentry = require("@sentry/nextjs");

const OtcState = {
    DISABLED: 0
}

async function getMarkets(session) {
    const offers = await getPermittedOfferList(session)
    return {
        markets: offers.filter(el => el.market !== OtcState.DISABLED),
        otcFee: Number(getEnv().feeOtc),
        currencies: getEnv().currencies,
        diamond: getEnv().diamondBased
    }
}

async function getOffers(req) {
    const otcId = Number(req.params.id)
    return await getActiveOffers(otcId)
}

async function getHistory(req) {
    try {
        const ID = Number(req.params.id)
        return await getHistoryOffers(ID)
    } catch (e) {
        Sentry.captureException("getHistoryOffers", {req, e});
        return []
    }

}

async function createOffer(user, req) {
    const {address} = user

    try {
        const offerId = Number(req.params.id)
        const isBuy = Boolean(req.body.isBuyer)
        const amount = Number(req.body.amount)
        const price = Number(req.body.price)
        const networkChainId = Number(req.body.networkChainId)
        const now = moment().unix()
        const hash = createHash(`${address}` + `${now}`)
        return await saveOtcHash(address, networkChainId, offerId, hash, price, amount, isBuy)
    } catch (e) {
        return {
            ok: false,
        }
    }
}

async function signOffer(user, req) {
    const {address} = user


    try {
        const offerId = Number(req.params.id)
        const networkChainId = Number(req.body.networkChainId)
        const otcId = Number(req.body.otcId)
        const dealId = Number(req.body.dealId)
        const expireDate =  moment.utc().unix() + 3 * 60
        const dbCheck = await signOtcTransaction(address, offerId, networkChainId, otcId, dealId, expireDate)
        const signature = await signData(address, otcId, dealId, dbCheck.nonce, expireDate)
        if(!signature.ok){
            throw new Error("Invalid signature")
        }

        return {
            ok: true,
            data: {
                nonce: dbCheck.nonce,
                expiry: expireDate,
                hash: signature.data
            }
        }
    } catch (e) {
        console.log("signOffer e",e)
        return {
            ok: false,
        }
    }
}



module.exports = {getMarkets, getOffers, getHistory, createOffer, signOffer}
