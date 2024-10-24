const { Op, QueryTypes, Sequelize } = require("sequelize");
const { models } = require("../services/db/definitions/db.init");
const db = require("../services/db/definitions/db.init");
const { OTC_ERRORS } = require("../../src/lib/enum/otc");
const { getWhereClause } = require("../utils");

const defaultSortColumns = {
    isSell: "isSell",
    amount: "amount",
    price: "price",
    multiplier: Sequelize.literal("price / amount"),
    chain: "chainId",
    updatedAt: "updatedAt",
};

function constructOffersOrder(sortBy = "updatedAt", sortOrder = "DESC", columns = defaultSortColumns) {
    const orderDirection = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const orderColumn = columns[sortBy] || "id";
    const offerOrder = [[orderColumn, orderDirection]];

    return offerOrder;
}

async function getActiveOffers(otcId, query) {
    const { sortId, sortOrder, ...filters } = query;

    const order = constructOffersOrder(sortId, sortOrder);
    const whereClause = getWhereClause(filters, ["maker"], ["isSell"]);

    return models.otcDeal.findAll({
        order,
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
            "updatedAt",
            [db.literal('"onchain"."chainId"'), "chainId"],
            [Sequelize.literal("price / amount"), "multiplier"],
        ],
        where: {
            ...whereClause,
            otcId,
            isFilled: false,
            isCancelled: false,
            onchainIdMaker: { [Op.ne]: null },
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

    const order = constructOffersOrder(sortId, sortOrder);

    return models.otcDeal.findAll({
        order,
        attributes: [
            "id",
            "offerId",
            "price",
            "amount",
            "isSell",
            [db.literal('"onchain"."chainId"'), "chainId"],
            [Sequelize.literal("price / amount"), "multiplier"],
            "updatedAt",
        ],
        where: {
            offerId,
            isFilled: true,
        },
        include: {
            model: models.onchain,
            attributes: [],
            required: true, // Ensures INNER JOIN
        },
        raw: true,
    });
}

const query_getLatestDeals = `
    SELECT
        od."id",
        od."offerId",
        od."isSell",
        od."price",
        od."amount",
        od."createdAt",
        od."price" / od."amount" AS "multiplier",
        o."name",
        o."slug"
    FROM
        "otcDeal" od
    JOIN
        offer o ON o.id = od."offerId"
    WHERE
        o.display = true
        AND od."otcId" <> 0
        AND od."otcId" = o."otc"
        AND od."isFilled" = false
        AND od."isCancelled" = false
        AND od."onchainIdMaker" IS NOT NULL
        AND (
            o."isOtcExclusive" = false
            OR (o."isOtcExclusive" = true AND o."broughtBy" = :tenantId)
        )
    ORDER BY
        :order
    LIMIT 10;
`;

async function getLatestOffers(query, tenantId, partnerId) {
    const { sortId, sortOrder } = query;

    const order = constructOffersOrder(sortId, sortOrder);

    return await db.query(query_getLatestDeals, {
        type: QueryTypes.SELECT,
        replacements: { order, tenantId, partnerId },
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
    getLatestOffers,
    getActiveOffers,
    getHistoryOffers,
    saveOtcHash,
    checkDealBeforeSigning,
    getUserPendingOffers,
    processSellOtcDeal,
    saveOtcLock,
};
