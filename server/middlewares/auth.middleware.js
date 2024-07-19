const { verifyID } = require("../../src/lib/authHelpers");

module.exports = async function authMiddleware(req, res, next) {
    const { auth, user } = await verifyID(req);
    if (!auth) {
        return res.status(401).json({ ok: false });
    } else {
        req.user = user;
        next();
    }
};
