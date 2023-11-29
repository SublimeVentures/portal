const {models} = require('../services/db/db.init');
const {Op} = require("sequelize");
const logger = require("../../src/lib/logger");

const {serializeError} = require("serialize-error");

async function getPublicPartners() {
    try {
        return await models.partner.findAll({
            attributes: ['logo', 'name'],
            where: {
                isVisible: true
            },
            raw: true
        });
    } catch (error) {
        logger.error('QUERY :: [getPublicPartners]', {error: serializeError(error)});
    }
    return []
}

async function getPartners(isDev, isBased) {
    let filter = isBased ? {} : {level: {[Op.lt]: 10}}

    try {
        return await models.partner.findAll({
            where: {
                isEnabled: true,
                ...filter
            },
            include: {model: models.network, where: {isDev}},
            raw: true
        });
    } catch (error) {
        logger.error('QUERY :: [getPartners]', {error: serializeError(error)});
    }
    return []

}

module.exports = {getPublicPartners, getPartners}
