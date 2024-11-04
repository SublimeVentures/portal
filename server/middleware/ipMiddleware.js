const requestIp = require("request-ip");
const geo = require("geoip-country");

const ipMiddleware = function (req, res, next) {
    req.userIp = requestIp.getClientIp(req);
    req.userCountry = geo.lookup(req.userIp)?.country;
    next();
};

module.exports = { ipMiddleware };
