const {models} = require("../services/db");

async function upsertDelegation(data) {
  const {address, vault, partner, tokenId } = data;
  return await models.delegates.upsert({address, vault, partner, tokenId });
}

module.exports = { upsertDelegation }
