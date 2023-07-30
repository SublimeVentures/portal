const Sentry = require("@sentry/nextjs");
const {models} = require('../services/db/db.init');

async function getStoreItemsOwned(owner) {
    try {
        return models.storeUser.findAll(
            {
                where: {
                    owner
                },
                attributes: ['owner', 'amount', 'storeId'],
                order: [
                    ['storeId', 'ASC'],
                ],
                raw: true
            })
    } catch (e) {
        Sentry.captureException({location: "getStoreItemsOwned", type: 'query', e});
    }
    return []

}


module.exports = {getStoreItemsOwned}
