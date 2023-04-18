
async function addReservedTransaction(id, slug, address, hash, amount, currency, acl) {
  const ParticipantLog = require("../models/participantLog.js")(`${id}.${slug}`);
  return await ParticipantLog.findOneAndUpdate({address, hash}, {amount, currency, acl}, {upsert: true});
}

async function expireReservedTransaction(id, slug, address, hash) {
  const ParticipantLog = require("../models/participantLog.js")(`${id}.${slug}`);
  return await ParticipantLog.findOneAndUpdate({address, hash}, {isExpired: true});
}

module.exports = { addReservedTransaction, expireReservedTransaction }
