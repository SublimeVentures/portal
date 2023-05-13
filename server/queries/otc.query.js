const {models} = require('../services/db/index');

async function getActiveOffers(offerId) {
  return models.otcDeals.findAll({
    attributes: ['dealId', 'offerId', 'buyer', 'seller', 'amount', 'price', 'createdAt'],
    where: {offerId, state: 0},
    raw: true
  })
}

async function getHistoryOffers(offerId) {
  return models.otcDeals.findAll({
    attributes: ['dealId', 'offerId', 'buyer', 'seller', 'amount', 'price', 'updatedAt'],
    where: {offerId, state: 1},
    raw: true
  })
}

module.exports = { getActiveOffers, getHistoryOffers}
