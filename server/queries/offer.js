const Offer = require("../models/offer.js");
const Raise = require("../models/raise.js");

async function getOfferList(extraFilter) {
  return Offer.find({display: true, ...extraFilter})
}

async function getOfferDetails(slug) {
  return Offer.findOne({display: true, slug:slug})
}

async function getOfferReservedData(id) {
  return Offer.findOne({id: id}, {alloTotal:1, slug:1, alloTotalPartner:1, b_tax:1, b_isPaused:1, d_open:1, d_openPartner:1, _id:0})
}

async function getOfferRaise(id) {
  return Raise.findOne({id: id}, {_id:0})
}

async function getOffersWithOpenOtc() {
  return Offer.find({b_otc: {$ne : 0}}, {name:1, ticker:1, b_ppu:1, slug:1, b_otc:1, id:1, _id:0 })
}

module.exports = { getOffersWithOpenOtc, getOfferList, getOfferDetails, getOfferReservedData, getOfferRaise }
