const Investment = require("../models/investment.js");

async function getUserInvestment(owner, offerId) {
  return Investment.findOne({owner, offerId}, '-_id')
}
async function getUserInvestments(owner) {
  return Investment.find({owner}, '-_id')
}


module.exports = { getUserInvestment, getUserInvestments }
