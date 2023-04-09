const Partner = require("../models/partner.js");


async function getPartners() {
  return Partner.find({isVisible: true}, {createdAt:0, updatedAt:0, isVisible:0, _id:0})
}
async function getPartner(partnerAddress) {
  return Partner.findOne({address: partnerAddress}, {createdAt:0, updatedAt:0, isVisible:0,_id:0, level:0, isPartner: 0})
}

module.exports = { getPartners, getPartner }
