const Offer = require("../models/offer.js");

async function getOffersPublic() {
  return Offer.find({displayPublic: true}, {name:1, image:1, genre:1, url_web:1, _id:0})
}

async function getOfferList() {
  return Offer.find({display: true}, {name:1, image:1, genre:1, slug:1, d_open:1, d_close:1, _id:0})
}


async function getOfferDetails(slug) {
  return Offer.findOne({display: true, slug:slug})
}



module.exports = { getOffersPublic, getOfferList, getOfferDetails }
