const {models} = require('../services/db/index');

async function getOffersPublic() {
    return await models.offers.findAll({
        attributes: ['name', 'image', 'genre', 'url_web'],
        where: {
            displayPublic: true
        },
        raw: true
    });
}

module.exports = {getOffersPublic}
