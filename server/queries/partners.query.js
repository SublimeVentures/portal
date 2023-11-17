const {models} = require('../services/db/db.init');
const Sentry = require("@sentry/nextjs");
const {Op} = require("sequelize");

async function getPublicPartners() {
    try {

        return await models.partner.findAll({
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

async function getPartners(isDev, isBased) {
    let filter = isBased ? {level: {[Op.gt]: 9}} : {level: {[Op.lt]: 10}}

    try {
        return await models.partner.findAll({
            where: {
                isEnabled: true,
                ...filter
            },
            include: {model: models.network, where: {isDev}},
            raw: true
        });
    } catch (e) {
        console.log("error",e)
        Sentry.captureException({location: "getPartners", type: 'query', e});
    }
    return []

}

module.exports = {getPublicPartners, getPartners}
