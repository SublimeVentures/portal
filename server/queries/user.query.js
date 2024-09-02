const { models } = require("../services/db/definitions/db.init");
const logger = require("../services/logger");

async function updateUserData({ userId, ...data }) {
    const updateObj = Object.fromEntries(
        Object.entries(data).map(([key, val]) => {
            return [key, val === "" ? null : val];
        }),
    );
    return models.user
        .findByPk(userId)
        .then((user) => user.update(updateObj))
        .then(() => Object.entries(updateObj))
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
