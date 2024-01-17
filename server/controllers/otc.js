const {getActiveOffers, getHistoryOffers, saveOtcHash, checkDealBeforeSigning, processSellOtcDeal,
    saveOtcLock
} = require("../queries/otc.query");
const {getPermittedOfferList} = require("./offerList");
const moment = require("moment");
const {createHash} = require("./helpers");
const {signData} = require("../../src/lib/authHelpers");
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");
const db = require("../services/db/definitions/db.init");
const { isAddress } = require('web3-validator');
const axios = require("axios");

async function getMarkets(session) {
    try {
        const offers = await getPermittedOfferList(session, true)
        console.log("offers markets", offers, session)
        return offers
    } catch(error) {
        logger.error(`ERROR :: [getOffers] OTC`, {error: serializeError(error)});
        return {
            markets: [],
        }
    }

}

async function getOffers(req) {
    try {
        return await getActiveOffers(Number(req.params.id))
    } catch(error) {
        logger.error(`ERROR :: [getOffers] OTC`, {error: serializeError(error)});
        return []
    }

}

async function getHistory(req) {
    try {
        return await getHistoryOffers(Number(req.params.id))
    } catch (error) {
        logger.error(`ERROR :: [getHistory] OTC`, {error: serializeError(error)});
        return []
    }

}

async function createOffer(user, req) {
    const {userId, wallets} = user

    try {
        const offerId = Number(req.params.id)
        const isSell = Boolean(req.body.isSell)
        const amount = Number(req.body.amount)
        const price = Number(req.body.price)
        const networkChainId = Number(req.body.networkChainId)
        if(!wallets.includes(req.body.account) && !isAddress(req.body.account)) {
            throw Error("Account not assigned to user")
        }

        const now =  moment.utc().unix()
        const hash = createHash(`${userId}` + `${now}`)
        const saved =  await saveOtcHash(req.body.account, networkChainId, offerId, hash, price, amount, isSell)

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
    const {userId, wallets} = user

    console.log("user",user)

    let transaction

    try {
        const offerId = Number(req.params.id)
        const networkChainId = Number(req.body.chainId)
        const otcId = Number(req.body.otcId)
        const dealId = Number(req.body.dealId)
        const expireDate =  moment.utc().unix() + 3 * 60
        const wallet = wallets.find(el=> el === req.body.wallet)
        console.log("wallet",wallet, wallets, req.body.wallet)
        if(!wallet) throw new Error("Bad wallet")

        transaction = await db.transaction();

        const deal = await checkDealBeforeSigning(offerId, networkChainId, otcId, dealId, transaction)
        if(!deal.ok) return deal

        const isBuyLockup = await processSellOtcDeal(userId, deal.data, transaction)
        if(!isBuyLockup.ok) return isBuyLockup

        await saveOtcLock(userId, wallet, deal.data, expireDate, transaction)

        console.log("jestem")
        const signature = await axios.post(`${process.env.AUTHER}/otc/sign`, {
            wallet, otcId, dealId, nonce: deal.data.id, expireDate
        }, {
            headers: {
                'content-type': 'application/json'
            }
        });
        console.log("sig data", signature.data)

        // const signature = await signData(address, otcId, dealId, deal.data.id, expireDate)
        if(!signature?.data?.ok){
            throw new Error("Invalid signature")
        }

        await transaction.commit();

        return {
            ok: true,
            data: {
                nonce: deal.data.id,
                expiry: expireDate,
                hash: signature.data.data
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
