const queries = require("../../queries/user.query");

async function updateUserData(req, res) {
    const { userId } = req.user;

    return queries
        .updateUserData({ userId, ...req.body })
        .then(async (updates) => {
            return res.json({
                ok: true,
                updates,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                ok: false,
                error,
            });
        });
}

async function getUser(req, res) {
    const { userId } = req.user;
    queries
        .getUser(userId)
        .then((user) => {
            return res.json({
                ok: true,
                user,
            });
        })
        .catch((err) => {
            return res.status(400).json({
                ok: false,
                error: err.message,
            });
        });
}

module.exports = {
    updateUserData,
    getUser,
};
