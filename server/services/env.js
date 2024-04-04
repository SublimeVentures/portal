const logger = require("../../src/lib/logger");
const { getEnvironment } = require("../queries/environment.query");

let env = {};

function getEnv() {
    return env;
}

async function fetchEnv() {
    try {
        env = await getEnvironment();
        logger.info("|---- ENV: ", env);
    } catch (error) {
        logger.error("refreshEnvironment", error);
    }
}

module.exports = { fetchEnv, getEnv };
