import db from "@/services/db/db.setup"
import Sentry from "@sentry/nextjs";

export async function upsertDelegation(data) {
    try {
        const {address, vault, partner, tokenId} = data;
        return await db.models.delegates.upsert({address, vault, partner, tokenId});
    } catch (e) {
        Sentry.captureException({location: "upsertDelegation", type: 'query', e, data});
    }
    return {}
}
