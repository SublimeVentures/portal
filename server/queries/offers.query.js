const {models} = require('../services/db/index');

async function getOffersPublic() {
    return models.offers.findAll({
        attributes: ['name', 'image', 'genre', 'url_web', 'slug'],
        where: {
            displayPublic: true
        },
        raw: true
    });
}

async function getOfferList() {
    return models.offers.findAll({
        where: {
            display: true
        },
        raw: true
    })
}

async function getOfferDetails(slug) {
    return models.offers.findOne({
        where: {
            display: true, slug
        },
        raw: true
    })
}

async function getOfferReservedData(id) {
    return models.offers.findOne({
        where: {id},
        raw: true
    })
}
//
// async function getOffersWithOpenOtc() {
//     return Offer.find({b_otc: {$ne : 0}}, {name:1, ticker:1, b_ppu:1, slug:1, b_otc:1, id:1, _id:0 })
// }


module.exports = {getOffersPublic, getOfferList, getOfferDetails, getOfferReservedData}
