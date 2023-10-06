const {models} = require('../services/db/db.init');
const Sentry = require("@sentry/nextjs");

async function getOffersPublic() {
    try {
        return models.offers.findAll({
            attributes: ['name', 'genre', 'url_web', 'slug'],
            where: {
                displayPublic: true
            },
            order: [
                ['d_open', 'DESC'],
            ],
            raw: true
        });
    } catch (e) {
        Sentry.captureException({location: "getOffersPublic", type: 'query', e});
    }
    return []
}

async function getOfferList() {
    try {

        return models.offers.findAll({
            where: {
                display: true
            },
            order: [
                ['d_open', 'DESC'],
            ],
            raw: true
        })
    } catch (e) {
        Sentry.captureException({location: "getOfferList", type: 'query', e});
    }
    return []
}

async function getOfferDetails(slug) {
    try {

        return models.offers.findOne({
            where: {
                display: true, slug
            },
            raw: true
        })
    } catch (e) {
        Sentry.captureException({location: "getOfferDetails", type: 'query', e});
    }
    return {}
}

async function getOfferById(id) {
    try {
        return models.offers.findOne({
            where: {id},
            raw: true
        })
    } catch (e) {
        Sentry.captureException({location: "getOfferById", type: 'query', e});
    }
    return {}
}


module.exports = {getOffersPublic, getOfferList, getOfferDetails, getOfferById}
