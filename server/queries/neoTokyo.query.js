const {models} = require('../services/db/db.init');
const {Op} = require("sequelize");
const logger = require("../services/logger");
const {serializeError} = require("serialize-error");

async function checkElite(array) {
    try {
        return await models.ntElite.findAll({
            where: {
                id: {
                    [Op.in]: array // Ensure it uses the Op.in
                }
            },
            raw: true
        })
    } catch (error) {
        logger.error('QUERY :: [checkElite]', {error: serializeError(error)});
    }
    return []
}

async function checkBytesStake(array) {
    try {
        const conditions = array.map(item => {
            return { tokenId: item.tokenId, season: item.season };
        });

        return await models.ntStake.findAll({
            where: {
                [Op.or]: conditions
            },
            raw: true
        });
    } catch (error) {
        logger.error('QUERY :: [checkBytesStake]', {error: serializeError(error)});
    }
    return []
}

module.exports = {checkElite, checkBytesStake}
