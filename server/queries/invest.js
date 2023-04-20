const Raise = require("../models/raise.js");

async function reserveAllocation(id, amount, totalAllocation, separatePools) {
  let extraFilter
  let updateConditions
  if(separatePools) {
    extraFilter = { $expr: { $lte: [ {$add : ['$alloResPartner', '$alloFilledPartner', '$alloSidePartner', amount]}, totalAllocation ] } }
    updateConditions = { $inc: { alloRes: amount } }
  } else {
    extraFilter = { $expr: { $lte: [ {$add : ['$alloRes', '$alloFilled', '$alloSide', amount]}, totalAllocation ] } }
    updateConditions = { $inc: { alloRes: amount } }
  }

  return Raise.findOneAndUpdate({id: id, ...extraFilter},  updateConditions, {new:true})
}


module.exports = { reserveAllocation }
