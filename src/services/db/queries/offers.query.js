import db from "@/services/db/db.setup"
import Sentry from "@sentry/nextjs";

export async function getPortfolio() {
    try {
        return db.models.offers.findAll({
            attributes: ['name', 'genre', 'url_web', 'slug'],
            where: {
                displayPublic: true
            },
            raw: true
        });
    } catch (e) {
        Sentry.captureException({location: "getPortfolio", type: 'query', e});
    }
    return []
}

export async function getOfferList() {
    try {

        return db.models.offers.findAll({
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

export async function getOfferDetails(slug) {
    try {

        return db.models.offers.findOne({
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

export async function getOfferReservedData(id) {
    try {
        return db.models.offers.findOne({
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


