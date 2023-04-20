
async function addReservedTransaction(id, address, hash, amount, currency, acl, nftId) {
  const ParticipantLog = require("../models/participantLog.js")(`${id}`);
  return await ParticipantLog.findOneAndUpdate({address, hash}, {amount, currency, acl, nftId}, {upsert: true});
}

async function expireReservedTransaction(id, address, hash) {
  const ParticipantLog = require("../models/participantLog.js")(`${id}`);
  return await ParticipantLog.findOneAndUpdate({address, hash}, {isExpired: true});
}

async function removeReservedTransaction(id, address, hash) {
  const ParticipantLog = require("../models/participantLog.js")(`${id}`);
  return await ParticipantLog.findOneAndDelete({address, hash});
}

module.exports = { addReservedTransaction, expireReservedTransaction, removeReservedTransaction }
