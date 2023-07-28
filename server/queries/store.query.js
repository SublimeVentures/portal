const Sentry = require("@sentry/nextjs");
const {models} = require('../services/db/db.init');

async function getStore() {
    try {
        return models.store.findAll({
            attributes: ['id', 'name', 'description', 'price', 'enabled', 'availability'],
            order: [
                ['id', 'ASC'],
            ],
            raw: true
        })
    } catch (e) {
        Sentry.captureException({location: "getStore", type: 'query', e});
    }
    return []

}


module.exports = {getStore}
