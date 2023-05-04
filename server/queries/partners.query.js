const {models} = require('../services/db/index');

async function getPublicPartners() {
    return await models.partners.findAll({
        attributes: ['logo', 'name'],
        where: {
            isVisible: true
        },
        raw: true
    });
}

async function getPartners(isDev) {
    return await models.partners.findAll({
        where: {
            isEnabled: true
        },
        include: {model: models.networks, where: {isDev}},
        raw: true
    });
}

module.exports = {getPublicPartners, getPartners}
