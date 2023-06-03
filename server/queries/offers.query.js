const {models} = require('../services/db/index');
const Sentry = require("@sentry/nextjs");

async function getOffersPublic() {
    try {
        return models.offers.findAll({
            attributes: ['name', 'image', 'genre', 'url_web', 'slug'],
            where: {
                displayPublic: true
            },
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

async function getOfferReservedData(id) {
    try {
        return models.offers.findOne({
            where: {id},
            raw: true
        })
    } catch (e) {
        Sentry.captureException({location: "getOfferReservedData", type: 'query', e});
    }
    return {}
}

// async function getOffersWithOpenOtc() {
//     return Offer.find({b_otc: {$ne : 0}}, {name:1, ticker:1, b_ppu:1, slug:1, b_otc:1, id:1, _id:0 })
// }


module.exports = {getOffersPublic, getOfferList, getOfferDetails, getOfferReservedData}
