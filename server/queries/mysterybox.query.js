const Sentry = require("@sentry/nextjs");
const {models} = require('../services/db/db.init');

async function openMysterybox(owner, isClaimed) {
    try {
        return models.lootbox.findAll({
            attributes: ['id', 'claimed'],
            where: {
                owner, claimed: isClaimed
            },
            order: [
                ['createdAt', 'DESC'],
            ],
            raw: true
        })
    } catch (e) {
        Sentry.captureException({location: "getUserLootbox", type: 'query', e});
    }
    return []

}


module.exports = {openMysterybox}
