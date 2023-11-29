const {models} = require('../services/db/db.init');
const db = require('../services/db/db.init');
const {Op} = require("sequelize");
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");
const {OfferAccessACL,aclToOfferAccessMap } = require("../../src/lib/authHelpers");

async function getUserInvestment(userId, offerId) {
    try {
        return models.vault.findOne({
            attributes: ['invested'],
            where: {
                userId,
                offerId
            },
            raw: true
        });
    } catch (error) {
        logger.error('QUERY :: [getUserInvestment]', {error: serializeError(error), userId, offerId});
    }
    return {}

}

async function getUserVault(userId, ACL) {
    try {
        const allowedOfferAccesses = aclToOfferAccessMap[ACL];
        return models.vault.findAll({
            where: {
                userId,
                invested: {
                    [Op.not]: 0
                }
            },
            order: [
                ['createdAt', 'DESC'],
            ],
            include: {
                attributes: ['slug', 'name', 'tge', 'ppu', 't_unlock'],
                model: models.offer,
                where: {
                    access: allowedOfferAccesses.length > 0 ? { [Op.in]: allowedOfferAccesses } : null
                }
            },
            raw: true
        })
    } catch (error) {
        logger.error('QUERY :: [getUserVault]', {error: serializeError(error), userId});
    }
    return []
}


module.exports = {getUserInvestment, getUserVault}
