const {models} = require('../services/db/definitions/db.init');
const db = require('../services/db/definitions/db.init');
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");

async function getStoreItemsOwned(userId, tenantId) {
    try {
        return models.storeUser.findAll({
            where: {
                userId: userId
            },
            include: [{
                model: models.storePartner,
                as: 'storePartner', // replace with the correct alias if you have defined one
                where: {
                    tenantId: tenantId
                },
                include: [{
                    model: models.store,
                    as: 'store', // replace with the correct alias if you have defined one
                    attributes: [] // Only fetch the storeId
                }],
                attributes: [] // No additional attributes from storePartner are needed
            }],
            attributes: [
                'amount',
                [db.literal('"storePartner->store"."id"'), 'id'],
                [db.literal('"storePartner->store"."name"'), 'name'],
                [db.literal('"storePartner"."img"'), 'img'],

            ],
            raw: true
        });
    } catch (error) {
        logger.error('QUERY :: [getStoreItemsOwned]', {error: serializeError(error), userId, tenantId});
    }
    return [];
}



async function getStoreItemsOwnedByUser(userId, tenantId, storeId, transaction) {
        const result = await models.storeUser.findOne({
            where: {
                userId
            },
            include: [{
                model: models.storePartner,
                as: 'storePartner', // replace with the correct alias if you have defined one
                where: {
                    tenantId,
                    storeId
                },
            }],
            attributes: [
                [db.literal('"storePartner"."id"'), 'storePartnerId'],
                [db.literal('"storePartner"."storeId"'), 'id'],
                'amount'
            ],
            raw: true,
            transaction
        });

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

async function updateUserUpgradeAmount(userId, storePartnerId, amount, transaction) {
    const result = await models.storeUser.increment(
        {amount},
        { where: { userId, storePartnerId }, raw:true, transaction })

    return {
        ok: result[0][1] === 1
    }

}


module.exports = {getStoreItemsOwned, getStoreItemsOwnedByUser, updateUserUpgradeAmount}
