const {getEnv} = require("../services/db");
const {getActiveOffers, getHistoryOffers, saveOtcHash, checkDealBeforeSigning, processSellOtcDeal,
    saveOtcLock
} = require("../queries/otc.query");
const {getPermittedOfferList} = require("./offerList");
const moment = require("moment");
const {createHash} = require("./helpers");
const {signData} = require("../../src/lib/authHelpers");
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");
const db = require("../services/db/db.init");
const {OTC_STATE} = require("../../src/lib/enum/otc");


async function getMarkets(session) {
    try {
        const offers = await getPermittedOfferList(session)
        return {
            markets: offers.filter(el => el.market !== OTC_STATE.DISABLED),
            otcFee: Number(getEnv().feeOtc),
            currencies: getEnv().currencies,
            diamond: getEnv().diamondBased
        }
    } catch(error) {
        logger.error(`ERROR :: [getOffers] OTC`, {error: serializeError(error)});
        return {
            markets: [],
            otcFee: Number(getEnv().feeOtc),
            currencies: getEnv().currencies,
            diamond: getEnv().diamondBased
        }
    }

}

async function getOffers(req) {
    try {
        const otcId = Number(req.params.id)
        return await getActiveOffers(otcId)
    } catch(error) {
        logger.error(`ERROR :: [getOffers] OTC`, {error: serializeError(error)});
        return []
    }

}

async function getHistory(req) {
    try {
        const ID = Number(req.params.id)
        return await getHistoryOffers(ID)
    } catch (error) {
        logger.error(`ERROR :: [getHistory] OTC`, {error: serializeError(error)});
        return []
    }

}

async function createOffer(user, req) {
    const {userId, address} = user

    try {
        const offerId = Number(req.params.id)
        const isSell = Boolean(req.body.isSell)
        const amount = Number(req.body.amount)
        const price = Number(req.body.price)
        const networkChainId = Number(req.body.networkChainId)
        const now =  moment.utc().unix()
        const hash = createHash(`${userId}` + `${now}`)
        const saved =  await saveOtcHash(address, networkChainId, offerId, hash, price, amount, isSell)

        if(!saved.ok)  return {
            ok: false,
            error: "Couldn't created offer"
        }

        return {
            ok: true,
            hash: hash
        }
    } catch (error) {
        logger.error(`ERROR :: [createOffer] OTC`, {error: serializeError(error), user, params: req.params, body: req.body});
        return {
            ok: false,
        }
    }
}

async function signOffer(user, req) {
    const {userId, address} = user

    let transaction

    try {
        const offerId = Number(req.params.id)
        const networkChainId = Number(req.body.networkChainId)
        const otcId = Number(req.body.otcId)
        const dealId = Number(req.body.dealId)
        const expireDate =  moment.utc().unix() + 3 * 60

        transaction = await db.transaction();

        const deal = await checkDealBeforeSigning(offerId, networkChainId, otcId, dealId, transaction)
        if(!deal.ok) return deal

        if(!deal.data.isSell) {
            const isBuyLockup = await processSellOtcDeal(userId, deal.data, transaction)
            if(!isBuyLockup.ok) return isBuyLockup
        }

        await saveOtcLock(userId, address, deal.data, expireDate, transaction)

        const signature = await signData(userId, otcId, dealId, deal.data.id, expireDate)
        if(!signature.ok){
            throw new Error("Invalid signature")
        }

        await transaction.commit();

        return {
            ok: true,
            data: {
                nonce: deal.data.id,
                expiry: expireDate,
                hash: signature.data
            }
        }
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        logger.error(`ERROR :: [signOffer] OTC`, {error: serializeError(error), user, body: req.body, params: req.params});
        return {
            ok: false,
            code: error.message
        }
    }
}

module.exports = {getMarkets, getOffers, getHistory, createOffer, signOffer}
