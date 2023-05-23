const {models} = require('../services/db/index');

async function getUserInvestment(owner, offerId) {
    return models.vaults.findOne({
        attributes: ['invested'],
        where: {
            owner,
            offerId
        },
        raw: true
    });
}

async function getUserVault(owner) {
    return models.vaults.findAll({
        where: {
            owner
        },
        include: {
            attributes: ['slug', 'image', 'name', 'tge', 'ppu', 't_unlock'],
            model: models.offers
        },
        raw: true
    })
}



module.exports = {getUserInvestment, getUserVault}
