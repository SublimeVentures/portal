import db from "@/services/db/db.setup"
import Sentry from "@sentry/nextjs";

export async function getInjectedUser(address) {
    try {
        return db.models.injectedUsers.findOne({
            where: {
                address
            },
            include: {model: db.models.partners},
            raw: true
        });
    } catch (e) {
        Sentry.captureException({location: "getInjectedUser", type: 'query', e});
    }
    return {}
}

export async function getInjectedUserAccess(address) {
    try {
        return db.models.injectedUsers.findOne({
            where: {
                address
            },
            raw: true
        });
    } catch (e) {
        Sentry.captureException({location: "getInjectedUserAccess", type: 'query', e});
    }
    return {}
}

