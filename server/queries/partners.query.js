const {models} = require('../services/db/db.init');
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

async function getPartners(isDev, is3VC) {
    let filter = is3VC ? {level: 10} : {level: 15}

    try {
        return await models.partners.findAll({
            where: {
                isEnabled: true,
                ...filter
            },
            include: {model: models.networks, where: {isDev}},
            raw: true
        });
    } catch (e) {
        console.log("error",e)
        Sentry.captureException({location: "getPartners", type: 'query', e});
    }
    return []

}

module.exports = {getPublicPartners, getPartners}
