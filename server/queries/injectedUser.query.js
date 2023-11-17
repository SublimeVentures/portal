const {models} = require('../services/db/db.init');
const logger = require("../services/logger");
const {serializeError} = require("serialize-error");

async function getInjectedUser(address) {
    try {
        return models.injectedUser.findOne({
            where: {
                address
            },
            include: {model: models.partners},
            raw: true
        });
    } catch (error) {
        logger.error('QUERY :: [getInjectedUser]', {error: serializeError(error), address});
    }
    return {}
}

async function getInjectedUserAccess(address) {
    try {
        return models.injectedUser.findOne({
            where: {
                address
            },
            raw: true
        });
    } catch (error) {
        logger.error('QUERY :: [getInjectedUserAccess]', {error: serializeError(error), address});
    }
    return {}
}

module.exports = {getInjectedUser, getInjectedUserAccess}
