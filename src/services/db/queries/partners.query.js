import db from "@/services/db/db.setup"
import Sentry from "@sentry/nextjs";

export async function getPublicPartners() {
    try {

        return await db.models.partners.findAll({
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

export async function getPartners(isDev) {
    try {
        return await db.models.partners.findAll({
            where: {
                isEnabled: true
            },
            include: {model: db.models.networks, where: {isDev}},
            raw: true
        });
    } catch (e) {
        Sentry.captureException({location: "getPartners", type: 'query', e});
    }
    return []

}

