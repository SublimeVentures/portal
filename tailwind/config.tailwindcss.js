const merge = require("lodash.merge");
const animatePlugin = require("tailwindcss-animate");

const coreConfig = require("./config.core.js");
const v2Config = require("./config.v2.js");

function loadTailwindConfig() {
    const tenant = process.env.NEXT_PUBLIC_TENANT || "1";
    return require(`./config.tenant_${tenant}.js`);
}

const mergedConfig = merge(coreConfig, v2Config, loadTailwindConfig());
mergedConfig.plugins = [
    ...coreConfig.plugins,
    ...v2Config.plugins,
    ...mergedConfig.plugins,
    animatePlugin
];

module.exports = mergedConfig;
