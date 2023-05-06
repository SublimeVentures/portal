async function expireReservedTransaction(id, address, hash) {
  const ParticipantLog = require("../models/participantLog.js")(`${id}`);
  return await ParticipantLog.findOneAndUpdate({address, hash}, {isExpired: true});
}


module.exports = { expireReservedTransaction }
