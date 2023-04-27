const Otc = require("../models/otc.js");

async function getActiveOffers(id) {
  return Otc.find({offerId: id, state:0}, {dealId:1, offerId:1, amount:1, price:1, seller:1, _id:0})
}

async function getHistoryOffers(id) {
  return Otc.find({offerId: id, state:1}, {dealId:1, offerId:1, amount:1, price:1, updatedAt:1, _id:0})
}

module.exports = { getActiveOffers, getHistoryOffers}
