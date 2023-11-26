const {models} = require('../services/db/db.init');
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");

async function getStore() {
    try {
        return models.store.findAll({
            attributes: ['id', 'name', 'description', 'price', 'priceBytes', 'enabled', 'availability'],
            order: [
                ['id', 'ASC'],
            ],
            raw: true
        })
    } catch (error) {
        logger.error('QUERY :: [getStore]', {error: serializeError(error)});
    }
    return []
}

module.exports = {getStore}
