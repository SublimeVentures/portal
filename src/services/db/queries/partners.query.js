const {models} = require('../services/db/index');
const Sentry = require("@sentry/nextjs");

async function getPublicPartners() {
    try {

        return await models.partners.findAll({
            attributes: ['logo', 'name'],
            where: {
                isVisible: true
            },
            raw: true
        });
    } catch (e) {
        Sentry.captureException({location: "getPublicPartners", type: 'query', e});
    }
    return []
}

async function getPartners(isDev) {
    try {
        return await models.partners.findAll({
            where: {
                isEnabled: true
            },
            include: {model: models.networks, where: {isDev}},
            raw: true
        });
    } catch (e) {
        Sentry.captureException({location: "getPartners", type: 'query', e});
    }
    return []

}

module.exports = {getPublicPartners, getPartners}
