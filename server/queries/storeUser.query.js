const {models} = require('../services/db/db.init');
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");
const {Op} = require("sequelize");
const {UPGRADE_ERRORS} = require("../enum/UpgradeErrors");

async function getStoreItemsOwned(userId) {
    try {
        return models.storeUser.findAll(
            {
                where: {
                    userId
                },
                attributes: ['userId', 'amount', 'storeId'],
                order: [
                    ['storeId', 'ASC'],
                ],
                raw: true
            })
    } catch (error) {
        logger.error('QUERY :: [getStoreItemsOwned]', {error: serializeError(error), userId});

    }
    return []
}


async function getStoreItemsOwnedByUser(userId, storeId, transaction) {
        const result = await models.storeUser.findOne({
            where: {
                userId,
                storeId,
                amount: {
                    [Op.gt]: 0
                }
            },
            raw: true
        }, { transaction })

        if(!result) {
            return {
                ok: false,
            }
        }

        return {
            ok:true,
            data: result
        }
}

async function updateUserUpgradeAmount(userId, storeId, amount, transaction) {
    const result = await models.storeUser.increment(
        {amount},
        { where: { userId, storeId }, raw:true, transaction })

    return {
        ok: result[0][1] === 1
    }

}


module.exports = {getStoreItemsOwned, getStoreItemsOwnedByUser, updateUserUpgradeAmount}
