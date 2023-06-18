import db from "@/services/db/db.setup"
import Sentry from "@sentry/nextjs";

export async function getPayableCurrencies(isDev) {
    try {
        return await db.models.currencies.findAll({
            attributes: ['address', 'precision', 'symbol', 'networkChainId'],
            where: {
                isSettlement: true
            },
            include: {
                attributes: ['isDev'],
                model: db.models.networks, where: {isDev}
            },
            raw: true
        })
    } catch (e) {
        Sentry.captureException({location: "getPayableCurrencies", type: 'query', e});
    }
    return []
}
