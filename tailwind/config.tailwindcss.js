const merge = require("lodash.merge");
const coreConfig = require("./config.core.js");

function loadTailwindConfig() {
    const tenant = process.env.NEXT_PUBLIC_TENANT || "1";
    return require(`./config.tenant_${tenant}.js`);
}

module.exports = merge(coreConfig, loadTailwindConfig());
