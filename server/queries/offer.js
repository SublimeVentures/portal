const Offer = require("../models/offer.js");
const Raise = require("../models/raise.js");

async function getOffersPublic() {
  return Offer.find({displayPublic: true}, {name:1, image:1, genre:1, url_web:1, _id:0})
}

async function getOfferList(extraFilter) {
  return Offer.find({display: true, ...extraFilter})
}

async function getOfferDetails(slug) {
  return Offer.findOne({display: true, slug:slug})
}

async function getOfferAllocation(id) {
  return Offer.findOne({id: id}, {alloTotal:1, slug:1, alloTotalPartner:1, b_tax:1, _id:0})
}

async function getOfferAllocationData(id) {
  return Raise.findOne({id: id}, {_id:0})
}

module.exports = { getOffersPublic, getOfferList, getOfferDetails, getOfferAllocation, getOfferAllocationData }
