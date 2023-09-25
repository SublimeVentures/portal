const {models} = require('../services/db/db.init');
const Sentry = require("@sentry/nextjs");
const {Op} = require("sequelize");

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

async function getOfferList(ACL) {
    try {

        return models.offers.findAll({
            where: {
                display: true,
                access: {
                    [Op.in]: ACL // Use Op.in to check if the 'access' value is in the array
                }
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

async function getOfferDetails(slug, ACL) {
    try {

        return models.offers.findOne({
            where: {
                display: true, slug,
                access: {
                    [Op.in]: ACL // Use Op.in to check if the 'access' value is in the array
                }
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
