const {models} = require('../services/db/index');

async function getOffersPublic() {
    return await models.offers.findAll({
        attributes: ['name', 'image', 'genre', 'url_web'],
        where: {
            displayPublic: true
        },
        raw: true
    });
}

async function getOfferList() {
    return await models.offers.findAll({
        where: {
            display: true
        },
        raw: true
    })
}

async function getOfferDetails(slug) {
    return await models.offers.findOne({
        where: {
            display: true, slug
        },
        raw: true
    })
}

async function getOfferRaise(id) {
    return await models.raises.findOne({
        where: {id},
        include: {
            attributes: ['id', 'alloTotalPartner'],
            model: models.offers
        }
    })
}


// async function getOfferReservedData(id) {
//     return Offer.findOne({id: id}, {alloTotal:1, slug:1, alloTotalPartner:1, b_tax:1, b_isPaused:1, d_open:1, d_openPartner:1, _id:0})
// }
//
// async function getOffersWithOpenOtc() {
//     return Offer.find({b_otc: {$ne : 0}}, {name:1, ticker:1, b_ppu:1, slug:1, b_otc:1, id:1, _id:0 })
// }


module.exports = {getOffersPublic, getOfferList, getOfferDetails, getOfferRaise}
