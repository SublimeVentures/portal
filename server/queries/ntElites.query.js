const {models} = require('../services/db/db.init');
const Sentry = require("@sentry/nextjs");

async function checkElite(array) {
    try {
        return models.ntElites.findAll({
            where: {
                id: array
            },
            raw: true
        })
    } catch (e) {
        Sentry.captureException({location: "checkElite", type: 'query', e});
    }
    return {}
}

module.exports = {checkElite}
