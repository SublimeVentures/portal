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
    return await models.upgrade.findAll({
        where: {
            userId,
            offerId
        },
        raw: true
    }, {transaction})

}

async function saveUpgradeUse(userId, offerId, storeId, amount, allocation, transaction) {

    const query = `
        INSERT INTO public."upgrade" ("userId", "amount", "createdAt", "updatedAt", "storeId", "offerId", "alloMax")
        VALUES (${userId}, ${amount}, now(), now(), ${storeId}, ${offerId}, ${allocation ? allocation : 0})
            ON CONFLICT ("userId", "storeId", "offerId") DO
        UPDATE SET "amount" = "upgrade"."amount" + EXCLUDED.amount, "updatedAt" = now();
    `

    const upsert = await db.query(query, {type: QueryTypes.UPSERT, transaction})
    if (upsert[0] === undefined && upsert[1] === null) {
        return {ok: true}
    } else {
        await transaction.rollback();
        return {
            ok: false,
            error: UPGRADE_ERRORS.ErrorSavingUse
        }
    }

}


module.exports = {saveUpgradeUse, fetchUpgrade, fetchAppliedUpgradesInTransaction}
