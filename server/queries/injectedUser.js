const InjectedUser = require("../models/injectedUser.js");


async function getInjectedUser(userAddress) {
  return InjectedUser.findOne({address: userAddress}, {_id:0})
}

module.exports = { getInjectedUser }
