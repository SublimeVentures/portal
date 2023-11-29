const {models} = require('../services/db/db.init');
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");
const {Op} = require("sequelize");
const {PremiumItemsENUM} = require("../../src/lib/enum/store");

async function getStore(isBased) {
    try {
        const whereClause = {};
        if (!isBased) {
            whereClause.id = { [Op.ne]: PremiumItemsENUM.Increased };
        }
        return models.store.findAll({
            attributes: ['id', 'name', 'description', 'price', 'priceBytes', 'enabled', 'availability'],
            where: whereClause,
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
