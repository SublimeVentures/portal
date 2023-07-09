const Sentry = require("@sentry/nextjs");
const {models} = require('../services/db/db.init');

async function getUserInvestment(owner, offerId) {
    try {
        return models.vaults.findOne({
            attributes: ['invested'],
            where: {
                owner,
                offerId
            },
            raw: true
        });
    } catch (e) {
        Sentry.captureException({location: "getUserInvestment", type: 'query', e});
    }
    return {}

}

async function getUserVault(owner) {
    try {
        return models.vaults.findAll({
            where: {
                owner
            },
            order: [
                ['createdAt', 'DESC'],
            ],
            include: {
                attributes: ['slug', 'name', 'tge', 'ppu', 't_unlock'],
                model: models.offers
            },
            raw: true
        })
    } catch (e) {
        Sentry.captureException({location: "getUserVault", type: 'query', e});
    }
    return []

}


module.exports = {getUserInvestment, getUserVault}
