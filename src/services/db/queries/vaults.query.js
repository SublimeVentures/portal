import Sentry from "@sentry/nextjs";
import db from "@/services/db/db.setup"

export async function getUserInvestment(owner, offerId) {
    try {
        return db.models.vaults.findOne({
            attributes: ['invested'],
            where: {
                owner,
                offerId
            },
            raw: true
        });
    } catch (e) {
        Sentry.captureException({location: "getUserInvestment", type: 'query', e});
    }
    return {}

}

export async function getUserVault(owner) {
    try {
        return db.models.vaults.findAll({
            where: {
                owner
            },
            include: {
                attributes: ['slug', 'name', 'tge', 'ppu', 't_unlock'],
                model: db.models.offers
            },
            raw: true
        })
    } catch (e) {
        Sentry.captureException({location: "getUserVault", type: 'query', e});
    }
    return []

}


