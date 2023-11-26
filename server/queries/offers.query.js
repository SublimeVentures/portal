const {models} = require('../services/db/db.init');
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");

async function getOffersPublic() {
    try {
        return models.offer.findAll({
            attributes: ['name', 'genre', 'url_web', 'slug'],
            where: {
                displayPublic: true
            },
            order: [
                ['d_open', 'DESC'],
            ],
            raw: true
        });
    } catch (error) {
        logger.error('QUERY :: [getOffersPublic]', {error: serializeError(error)});
    }
    return []
}

async function getOfferList() {
    try {

        return models.offer.findAll({
            where: {
                display: true
            },
            order: [
                ['d_open', 'DESC'],
            ],
            raw: true
        })
    } catch (error) {
        logger.error('QUERY :: [getOfferList]', {error: serializeError(error)});
    }
    return []
}

async function getOfferDetails(slug) {
    try {
        return models.offer.findOne({
            where: {
                display: true,
                slug
            },
            include: {
                model: models.offerDescription,
                attributes: ['description']
            },
            raw: true
        })
    } catch (error) {
        logger.error('QUERY :: [getOfferDetails]', {error: serializeError(error), slug, });
    }
    return {}
}

async function getOfferById(id) {
    try {
        return models.offer.findOne({
            where: {id},
            raw: true
        })
    } catch (error) {
        logger.error('QUERY :: [getOfferById]', {error: serializeError(error), id});
    }
    return {}
}


module.exports = {getOffersPublic, getOfferList, getOfferDetails, getOfferById}
