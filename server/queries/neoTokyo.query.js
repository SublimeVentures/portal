const {models} = require('../services/db/db.init');
const Sentry = require("@sentry/nextjs");
const {Op} = require("sequelize");

async function checkElite(array) {
    try {
        return await models.ntElite.findAll({
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

async function checkBytesStake(array) {
    try {
        const conditions = array.map(item => {
            return { tokenId: item.tokenId, season: item.season };
        });

        return await models.ntStake.findAll({
            where: {
                [Op.or]: conditions
            },
            raw: true
        });
    } catch (e) {
        console.log("Error in checkBytesStake", e);
        Sentry.captureException({location: "checkBytesStake", type: 'query', e});
        return {}; // Consider returning null or an appropriate error response
    }
    return {}
}

module.exports = {checkElite, checkBytesStake}
