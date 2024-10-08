const ErrorType = require("../../shared/enum/errorType.enum");
const { models } = require("../services/db/definitions/db.init");
const logger = require("../services/logger");

async function updateUserData({ userId, ...data }) {
    try {
        const updateObj = Object.fromEntries(
            Object.entries(data).map(([key, val]) => {
                return [key, val === "" ? null : val];
            }),
        );
        const found = await models.user.findByPk(userId);
        await found.update(updateObj);
        return Object.entries(updateObj);
    } catch (err) {
        handleError(ErrorType.QUERY, err, { methodName: "updateUserData", enableSentry: true });
        return [];
    }
}

async function getUser(userId) {
    try {
        const found = await models.user.findByPk(userId, {
            attributes: ["email", "phoneNumberE164", "username"],
            raw: true,
        });
        return found;
    } catch (err) {
        handleError(ErrorType.QUERY, err, { methodName: "getUser", enableSentry: true });
        throw err;
    }
}

module.exports = {
    updateUserData,
    getUser,
};
