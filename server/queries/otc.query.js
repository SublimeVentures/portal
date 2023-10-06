const {models} = require('../services/db/db.init');
const db = require('../services/db/db.init');
const {Op, DataTypes} = require("sequelize");
const moment = require("moment");
const Sentry = require("@sentry/nextjs");
///////////
///helpers
//////////
async function errorHandle(functionName, paramsToSave, error, transaction) {
    console.log("functionName", functionName, error)

    Sentry.captureException("otcOfferMade", JSON.stringify(paramsToSave));
    if (transaction) {
        await transaction.rollback();
    }
    return {
        ok: false,
        code: error.message,
    }
}


///////////
///queries
//////////
async function getActiveOffers(otcId) {
    return models.otcDeals.findAll({
        attributes: ['id', 'offerId', 'otcId', 'dealId', 'price', 'amount', 'currency', 'isSell', 'maker', 'networkChainId'],
        where: {otcId, isFilled: false, isCancelled: false, isOnChainConfirmed: true},
        raw: true
    })
}

async function getHistoryOffers(offerId) {
    return models.otcDeals.findAll({
        attributes: ['id', 'offerId', 'price', 'amount', 'isSell', 'networkChainId', 'updatedAt'],
        where: {offerId, isFilled: true},
        raw: true
    })
}


async function getUserPendingOffers(owner) {
    return models.otcLocks.findAll({
        attributes: ['expiryDate'],
        where: {isExpired: false, owner},
        include: {model: models.otcDeals, attributes: ['id', 'otcId', 'dealId', 'price', 'amount']},
        raw: true
    })
}


///////////
///events
//////////
async function saveOtcHash(address, networkChainId, offerId, hash, price, amount, isBuy) {
    let transaction

    try {
        transaction = await db.transaction();

        await models.otcDeals.create({
            offerId,
            price,
            amount,
            hash,
            networkChainId,
            isSell: !isBuy,
            maker: address,
        }, {transaction})

        await transaction.commit();

        return {
            ok: true,
            hash: hash
        }

    } catch (error) {
        return await errorHandle(
            "otcOfferTake",
            {address, networkChainId, hash},
            error,
            transaction
        )
    }
}

async function signOtcTransaction(address, offerId, networkChainId, otcId, dealId, expireDate) {
    let transaction

    try {
        transaction = await db.transaction();

        const deal = await models.otcDeals.findOne({
           where: {
               isCancelled: false,
               isFilled: false,
               offerId,
               networkChainId,
               otcId,
               dealId
           },
            raw:true,
            include: {model: models.offers, attributes: ['id', 'otc']},
            transaction
        })

        if(!deal) {
            throw new Error("BAD_DEAL")
        }

        if(deal.otcId !== deal['offer.otc']) {
            throw new Error("BAD_MARKET")
        }

        if(!deal.isSell) {
            const locked = await models.vaults.increment({"locked": deal.amount}, {
                where: {
                    [Op.and]: [
                        db.literal(`"owner" = '${address}' AND "offerId" = ${deal["offer.id"]} AND ("locked" + ${deal.amount} <= "invested")`)
                    ]
                },
                transaction
            });
            if (!locked[0][1]) {
                throw new Error("NOT_ENOUGH_ALLOCATION");
            }
        }

        await models.otcLocks.create({
            otcDealId: deal.id,
            expiryDate: expireDate,
            isExpired: false,
            amount:deal.amount,
            isSell: deal.isSell,
            offerId: deal["offer.id"],
            owner: address,
        }, {transaction})


        await transaction.commit();

        return {
            ok: true,
            nonce: deal.id
        }

    } catch (error) {
        console.log("saveOtcHash", error)
        if (transaction) {
            await transaction.rollback();
        }
        return {
            ok: false,
            code: error.message,
        }
    }
}

module.exports = {getActiveOffers, getHistoryOffers, saveOtcHash, signOtcTransaction, getUserPendingOffers}
