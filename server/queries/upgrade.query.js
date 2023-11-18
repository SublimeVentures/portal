const {models} = require('../services/db/db.init');
const db = require("../services/db/db.init");
const {Op, QueryTypes} = require("sequelize");
const {PremiumItemsENUM} = require("../../src/lib/enum/store");
const {UPGRADE_ERRORS} = require("../enum/UpgradeErrors");

async function fetchUpgrade(userId, offerId) {
    return await models.upgrade.findAll({
        attributes: ['amount', 'storeId', 'alloUsed', 'alloMax', 'isExpired'],
        where: {
            userId,
            offerId,
            amount: {
                [Op.gt]: 0
            }
        },
        raw: true
    })
}

async function fetchAppliedUpgradesInTransaction(userId, offerId, transaction) {
    const result = await models.upgrade.findAll({
        where: {
            userId,
            offerId
        },
        raw: true
    }, {transaction})

    if (result?.length === 0 || !result) {
        await transaction.rollback();
        return {
            ok: false,
            error: UPGRADE_ERRORS.NoAppliedUpgrade
        }
    }

    return {
        ok: true,
        data: result
    }
}

async function increaseGuaranteedAllocationUsed(offerId, userId, amount, transaction) {
    return await models.upgrade.increment({alloUsed: amount}, {
        where: {
            offerId,
            storeId: PremiumItemsENUM.Guaranteed,
            userId,
        },
        transaction
    });
}

async function saveUpgradeUse(userId, offerId, storeId, amount, allocation, transaction) {

    const query = `
        INSERT INTO public."upgrade" ("userId", "amount", "createdAt", "updatedAt", "storeId", "offerId", "alloMax")
        VALUES (${userId}, ${amount}, now(), now(), ${storeId}, ${offerId}, ${allocation ? allocation : 0}) on conflict("userId", "storeId", "offerId") do
        update set "amount"=(SELECT amount from public."upgrade" WHERE "userId" = EXCLUDED."userId" AND "storeId" = EXCLUDED."storeId" AND "offerId" = EXCLUDED."offerId") + EXCLUDED.amount, "updatedAt"=now();
    `

    const upsert = await db.query(query, {type: QueryTypes.UPSERT, transaction})
    // if (upsert[0] === undefined && upsert[1] === null) { //old
    if (upsert && upsert[0] >= 1) {
        return {ok: true}
    } else {
        await transaction.rollback();
        return {
            ok: false,
            error: UPGRADE_ERRORS.ErrorSavingUse
        }
    }

}


module.exports = {saveUpgradeUse, fetchUpgrade, fetchAppliedUpgradesInTransaction, increaseGuaranteedAllocationUsed}
