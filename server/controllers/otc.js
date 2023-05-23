const {getEnv} = require("../services/db/utils");
const {getActiveOffers, getHistoryOffers, saveOtcHash, removeOtcHash} = require("../queries/otc.query");
const {getParamOfferList} = require("./offerList");
const moment = require("moment");
const {checkAcl} = require("./acl");
const {createHash} = require("./helpers");


async function getMarkets(session, req) {
    const offers = await getParamOfferList(session, req)
    return {
        open: offers.filter(el => el.otc !== 0),
        otcFee: getEnv().feeOtc,
        currencies: getEnv().currencies,
        multichain: getEnv().multichain
    }
}

async function getOffers(session, req) {
    const ID = Number(req.params.id)
    return await getActiveOffers(ID)
}

async function getHistory(session, req) {
    const ID = Number(req.params.id)
    return await getHistoryOffers(ID)
}

async function createOffer(session, req) {
    const {ACL, ADDRESS, USER} = checkAcl(session, req)

    try {
        const ID = Number(req.params.id)
        const isBuy = Boolean(req.body.isBuyer)
        const amount = Number(req.body.amount)
        const price = Number(req.body.price)
        const networkChainId = Number(req.body.networkChainId)
        const now = moment().unix()
        const hash = createHash(`${ADDRESS}` + `${now}`)

        return await saveOtcHash(networkChainId, false, hash, ADDRESS, USER.id, ACL, isBuy, ID, amount, price)

    } catch (e) {
        return {
            ok: false,
        }
    }
}

async function removeOffer(session, req) {
    const {ACL, ADDRESS, USER} = checkAcl(session, req)

    try {
        const ID = Number(req.params.id)
        const networkChainId = Number(req.body.networkChainId)
        const hash = req.body.hash?.length < 8
        if(!hash) throw new Error("NO_PENDING_UPDATE");
        const result = await removeOtcHash(ID, networkChainId, req.body.hash, ADDRESS, USER.id, ACL)
        return {
            ok: result,
        }
    } catch(e) {
        return {
            ok: false,
        }
    }



}

module.exports = {getMarkets, getOffers, getHistory, createOffer, removeOffer}
