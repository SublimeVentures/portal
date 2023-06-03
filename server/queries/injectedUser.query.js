const {models} = require('../services/db/index');
const Sentry = require("@sentry/nextjs");

async function getInjectedUser(address) {
    try {
        return models.injectedUsers.findOne({
            where: {
                address
            },
            include: {model: models.partners},
            raw: true
        });
    } catch (e) {
        Sentry.captureException({location: "getInjectedUser", type: 'query', e});
    }
    return {}
}

async function getInjectedUserAccess(address) {
    try {
        return models.injectedUsers.findOne({
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

module.exports = {getInjectedUser, getInjectedUserAccess}
