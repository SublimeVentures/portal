const { models } = require("../services/db/definitions/db.init");
const logger = require("../services/logger");

async function updateUserData({ userId, ...data }) {
    return models.user
        .findByPk(userId)
        .then((user) => user.update(data))
        .then(() => Object.entries(data))
        .catch((err) => {
            logger.error(`ERROR :: [updateUserData] ${err.message}`);
            return [];
        });
}

async function getUser(userId) {
    return models.user
        .findByPk(userId, {
            attributes: ["email", "phoneNumberE164", "username"],
            raw: true,
        })
        .then((user) => user)
        .catch((err) => {
            logger.error(`ERROR :: [getUser] ${err.message}`);
            throw err;
        });
}

module.exports = {
    updateUserData,
    getUser,
};
