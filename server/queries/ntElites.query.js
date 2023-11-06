const {models} = require('../services/db/db.init');
const Sentry = require("@sentry/nextjs");
const {Op} = require("sequelize");

async function checkElite(array) {
    try {
        return await models.ntElites.findAll({
            where: {
                id: {
                    [Op.in]: array // Ensure it uses the Op.in
                }
            },
            raw: true
        })
    } catch (e) {
        console.log("random", e)
        Sentry.captureException({location: "checkElite", type: 'query', e});
    }
    return {}
}

module.exports = {checkElite}
