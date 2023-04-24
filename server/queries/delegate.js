const Delegate = require("../models/delegate.js");

async function upsertDelegation(data) {
  const {address, vault, partner, tokenId } = data;
  return Delegate.findOneAndUpdate({address, vault}, {partner, tokenId}, {upsert:true})
}

module.exports = { upsertDelegation }
