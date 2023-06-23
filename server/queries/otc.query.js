const {models} = require('../services/db/db.init');
const db = require("../services/db");
const {Op} = require("sequelize");

async function getActiveOffers(offerId) {
    return models.otcDeals.findAll({
        attributes: ['dealId', 'offerId', 'buyer', 'seller', 'amount', 'price', 'hashCreate', 'createdAt'],
        where: {offerId, state: 0},
        raw: true
    })
}

async function getHistoryOffers(offerId) {
    return models.otcDeals.findAll({
        attributes: ['dealId', 'offerId', 'buyer', 'seller', 'amount', 'price', 'updatedAt'],
        where: {offerId, state: 1},
        raw: true
    })
}

async function saveOtcHash(networkChainId, isTaker, hash, address, nftId, acl, isBuyer, offerId, amount, price) {
    const owner = acl === 0 ? nftId : address
    const data = {
        amount,
        price
    }

    try {
        const result = await db.transaction(async (t) => {

                if (!isBuyer) { //if i'm seller, check if i have enough free allocation
                    const booked = await models.vaults.increment({"locked": amount}, {
                        where: {
                            [Op.and]: [
                                db.literal(`"owner" = '${owner}' AND "offerId" = ${offerId} AND ("locked" + ${amount} <= "invested")`)
                            ]
                        }
                    }, {transaction: t});

                    if (!booked[0][1]) throw new Error("NOT_ENOUGH_ALLOCATION");
                }

                await models.otcPending.create({
                    hash,
                    address,
                    nftId,
                    acl,
                    isBuyer,
                    offerId,
                    networkChainId,
                    isTaker,
                    data,
                }, {transaction: t})

                return true;
            }
        );

        return {
            ok: true,
            hash: hash
        }

    } catch (error) {
        return {
            ok: false,
            code: error.message,
        }
    }
}

async function removeOtcHash(offerId, networkChainId, hash, address, nftId, acl) {
    const owner = acl === 0 ? nftId : address
    const filter = acl === 0 ? {nftId, acl} : {address, acl}

    try {
        await db.transaction(async (t) => {
                const isProcessing = await models.otcPending.findOne({
                    where: {
                        offerId,
                        isTaker: true,
                        isExpired: false,
                        hashRelated: hash
                    },
                    raw: true
                }, {transaction: t})

                if (isProcessing) throw new Error("TRANSACTION_PROCESSING");

                const status = await models.otcPending.update({isExpired: true}, {
                    where: {
                        ...filter,
                        hash,
                        offerId
                    },
                    raw: true,
                    returning: true,
                }, {transaction: t})
                if (status[0] === 0) throw new Error("NO_PENDING_UPDATE");

                const amount = status[1][0].data.amount
                const booked = await models.vaults.decrement({"locked": amount}, {
                    where: {
                        [Op.and]: [
                            db.literal(`"owner" = '${owner}' AND "offerId" = ${offerId} AND ("locked" - ${amount} >= 0)`)
                        ]
                    }
                }, {transaction: t});

                if (!booked[0][1]) throw new Error("UNLOCK_IMPOSSIBLE");

                return true;
            }
        );
        return true


    } catch (error) {
        //todo: logger
        console.log("error", error)
        return false
    }
}

module.exports = {getActiveOffers, getHistoryOffers, saveOtcHash, removeOtcHash}
