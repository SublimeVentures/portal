const {models} = require('../services/db/db.init');
const db = require('../services/db/db.init');
const {Op} = require("sequelize");
const {OTC_ERRORS} = require("../../src/lib/enum/otc");

///////////
///queries
//////////
async function getActiveOffers(otcId) {
    return models.otcDeal.findAll({
        attributes: [
            'id',
            'offerId',
            'otcId',
            'dealId',
            'price',
            'amount',
            'currency',
            'isSell',
            'maker',
            [db.literal('"onchain"."chainId"'), 'chainId'] // Alias 'chainId' from onchain
        ],
        where: {otcId, isFilled: false, isCancelled: false, onchainId: { [Op.ne]: null }},
        include: {
            model: models.onchain,
            attributes: [],
            required: true // Ensures INNER JOIN
        },
        raw: true
    });
}

async function getHistoryOffers(offerId) {
    return models.otcDeal.findAll({
        attributes: [
            'id',
            'offerId',
            'price',
            'amount',
            'isSell',
            [db.literal('"onchain"."chainId"'), 'chainId'],
            'updatedAt'
        ],
        where: {offerId, isFilled: true},
        include: {
            model: models.onchain,
            attributes: [],
            required: true // Ensures INNER JOIN
        },
        raw: true
    });
}



async function getUserPendingOffers(wallet) {
    return models.otcLock.findAll({
        attributes: ['expiryDate'],
        where: {isExpired: false, wallet},
        include: {model: models.otcDeals, attributes: ['id', 'otcId', 'dealId', 'price', 'amount']},
        raw: true
    })
}


///////////
///events
//////////
async function saveOtcHash(address, chainId, offerId, hash, price, amount, isSell) {
    const newOtcDeal = await models.otcDeal.create({
        offerId,
        price,
        amount,
        hash,
        isSell,
        chainId,
        maker: address,
    });

    return {
        ok: !!newOtcDeal,
    }
}
async function checkDealBeforeSigning(offerId, chainId, otcId, dealId, transaction) {
    const deal = await models.otcDeal.findOne({
        where: {
            offerId,
            otcId,
            dealId,
            isCancelled: false,
            isFilled: false,
            '$onchain.chainId$': chainId,
        },
        include: [
            {
                model: models.offer,
                attributes: ['id', 'otc']
            },
            {
                model: models.onchain,
                attributes: ['chainId']
            }
        ],
        raw: true,
        transaction: transaction
    });

    if (!deal) {
        await transaction.rollback();
        return {
            ok: false,
            error: OTC_ERRORS.BadDeal
        };
    }

    if (deal.otcId !== deal['offer.otc'] || deal['onchain.chainId'] !== chainId) {
        await transaction.rollback();
        return {
            ok: false,
            error: OTC_ERRORS.BadMarket
        };
    }

    return {
        ok: true,
        data: deal
    };
}


async function processSellOtcDeal(userId, deal, transaction) {
    const locked = await models.vault.increment({"locked": deal.amount}, {
        where: {
            [Op.and]: [
                db.literal(`"userId" = ${userId} AND "offerId" = ${deal["offer.id"]} AND ("locked" + ${deal.amount} <= "invested")`)
            ]
        },
        transaction
    });
    if (!locked[0][1]) {
        await transaction.rollback();
        return {
            ok: false,
            error: OTC_ERRORS.NotEnoughAllocation
        }
    }
    return {
        ok: true,
        data: locked
    }
}


async function saveOtcLock(userId, wallet, deal, expireDate, transaction) {
    await models.otcLock.create({
        userId,
        wallet,
        offerId: deal["offer.id"],
        otcDealId: deal.id,
        expiryDate: expireDate,
        isExpired: false,
        amount: deal.amount,
        isSell: deal.isSell,
    }, {transaction})

}

module.exports = {
    getActiveOffers,
    getHistoryOffers,
    saveOtcHash,
    checkDealBeforeSigning,
    getUserPendingOffers,
    processSellOtcDeal,
    saveOtcLock
}
