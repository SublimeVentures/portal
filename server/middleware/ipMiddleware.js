const requestIp = require("request-ip");

const ipMiddleware = function (req, res, next) {
    req.userIp = requestIp.getClientIp(req);
    next();
};

module.exports = { ipMiddleware };
