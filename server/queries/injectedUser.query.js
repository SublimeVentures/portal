const { models } = require('../services/db/index');

async function getInjectedUser(address) {
  return models.injectedUsers.findOne({
    where: {
      address
    },
    include: {model: models.partners},
    raw: true
  });
}

module.exports = { getInjectedUser }
