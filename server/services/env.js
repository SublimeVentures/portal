const logger = require("../../src/lib/logger");

async function fetchEnv() {
    logger.info("|---- ENV: skipping fetch");
    return Promise.resolve();
}

module.exports = { fetchEnv };
