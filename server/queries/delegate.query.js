const {models} = require("../services/db");
const Sentry = require("@sentry/nextjs");

async function upsertDelegation(data) {
    try {
        const {address, vault, partner, tokenId} = data;
        return await models.delegates.upsert({address, vault, partner, tokenId});
    } catch (e) {
        Sentry.captureException({location: "upsertDelegation", type: 'query', e, data});
    }
    return {}
}

module.exports = {upsertDelegation}
