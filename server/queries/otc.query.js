const { models } = require("../services/db/definitions/db.init");
const db = require("../services/db/definitions/db.init");
const { Op, Sequelize } = require("sequelize");
const { OTC_ERRORS } = require("../../src/lib/enum/otc");

async function getActiveOffers(otcId, query) {
    const { sortId, sortOrder, filters } = query;

    const validSortColumns = {
        isSell: "isSell",
        amount: "amount",
        price: "price",
        multiplier: Sequelize.literal("price / amount"),
        chain: 'chainId',
    };

    const orderDirection = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const orderColumn = validSortColumns[sortId] || 'otcId';
    const offerOrder = [[orderColumn, orderDirection]];

    let whereClause = {};

    // if (filters) {
    //     filters.split(',').forEach(filter => {
    //         // if (filter === 'me') whereClause.maker = currentUserId;
    //         if (filter === 'sell') whereClause.isSell = true;
    //         else if (filter === 'buy') whereClause.isSell = false;
    //     });
    // }

    return models.otcDeal.findAll({
        order: offerOrder,
        attributes: [
            "id",
            "offerId",
            "otcId",
            "dealId",
            "price",
            "amount",
            "currency",
            "isSell",
            "maker",
            [db.literal('"onchain"."chainId"'), "chainId"], // Alias 'chainId' from onchain
            [Sequelize.literal('price / amount'), 'multiplier'],
        ],
        where: {
            otcId,
            isFilled: false,
            isCancelled: false,
            onchainIdMaker: { [Op.ne]: null },
            ...whereClause,
        },
        include: {
            model: models.onchain,
            attributes: [],
            required: true, // Ensures INNER JOIN
            on: {
                id: { [Op.eq]: db.col("otcDeal.onchainIdMaker") },
            },
        },
        raw: true,
    });
}

async function getHistoryOffers(offerId, query) {
    const { sortId, sortOrder } = query;

    const validSortColumns = {
        isSell: "isSell",
        amount: "amount",
        price: "price",
        multiplier: Sequelize.literal("price / amount"),
        chain: 'chainId',
        date: 'updatedAt',
    };

    const orderDirection = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const orderColumn = validSortColumns[sortId] || 'offerId';
    const historyOrder = [[orderColumn, orderDirection]];

    return models.otcDeal.findAll({
        order: historyOrder,
        attributes: [
            "id",
            "offerId",
            "price",
            "amount",
            "isSell",
            [db.literal('"onchain"."chainId"'), "chainId"],
            [Sequelize.literal('price / amount'), 'multiplier'],
            "updatedAt",
        ],
        where: { offerId, isFilled: true },
        include: {
            model: models.onchain,
            attributes: [],
            required: true, // Ensures INNER JOIN
        },
        raw: true,
    });
}

async function getUserPendingOffers(wallet) {
    return models.otcLock.findAll({
        attributes: ["expiryDate"],
        where: { isExpired: false, wallet },
        include: {
            model: models.otcDeals,
            attributes: ["id", "otcId", "dealId", "price", "amount"],
        },
        raw: true,
    });
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
    };
}
async function checkDealBeforeSigning(offerId, chainId, otcId, dealId, transaction) {
    const deal = await models.otcDeal.findOne({
        where: {
            offerId,
            otcId,
            dealId,
            isCancelled: false,
            isFilled: false,
            "$onchain.chainId$": chainId,
        },
        include: [
            {
                model: models.offer,
                attributes: ["id", "otc"],
            },
            {
                model: models.onchain,
                attributes: ["chainId"],
                on: {
                    id: { [Op.eq]: db.col("otcDeal.onchainIdMaker") },
                },
            },
        ],
        raw: true,
        transaction: transaction,
    });

    if (!deal) {
        await transaction.rollback();
        return {
            ok: false,
            error: OTC_ERRORS.BadDeal,
        };
    }

    if (deal.otcId !== deal["offer.otc"] || deal["onchain.chainId"] !== chainId) {
        await transaction.rollback();
        return {
            ok: false,
            error: OTC_ERRORS.BadMarket,
        };
    }

    return {
        ok: true,
        data: deal,
    };
}

async function processSellOtcDeal(userId, deal, transaction) {
    const locked = await models.vault.increment(
        { locked: deal.amount },
        {
            where: {
                [Op.and]: [
                    db.literal(
                        `"userId" = ${userId} AND "offerId" = ${deal["offer.id"]} AND ("locked" + ${deal.amount} <= "invested")`,
                    ),
                ],
            },
            transaction,
        },
    );
    if (!locked[0][1]) {
        await transaction.rollback();
        return {
            ok: false,
            error: OTC_ERRORS.NotEnoughAllocation,
        };
    }
    return {
        ok: true,
        data: locked,
    };
}

async function saveOtcLock(userId, wallet, deal, expireDate, transaction) {
    await models.otcLock.create(
        {
            userId,
            wallet,
            offerId: deal["offer.id"],
            otcDealId: deal.id,
            expiryDate: expireDate,
            isExpired: false,
            amount: deal.amount,
            isSell: deal.isSell,
        },
        { transaction },
    );
}

module.exports = {
    getActiveOffers,
    getHistoryOffers,
    saveOtcHash,
    checkDealBeforeSigning,
    getUserPendingOffers,
    processSellOtcDeal,
    saveOtcLock,
};
