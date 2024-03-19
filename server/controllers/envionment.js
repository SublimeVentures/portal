const NodeCache = require("node-cache");

const envCache = new NodeCache();

module.exports = { envCache };
