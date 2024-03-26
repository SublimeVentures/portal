const db = require("./definitions/db.init");
const { getEnvironment } = require("../../queries/environment.query");
const { scheduleUpdateEnv } = require("../../services/cron");
const logger = require("../../../src/lib/logger");
let env = {};

function getEnv() {
    return env;
}

async function fetchEnv() {
    try {
        env = await getEnvironment();
        scheduleUpdateEnv(env);
        logger.info("|---- ENV: ", env);
    } catch (error) {
        logger.error("refreshEnvironment", error);
    }
}

async function connectDB() {
    try {
        await db.authenticate();
        logger.info("|---- DB: connected");
        await fetchEnv();
    } catch (error) {
        logger.error("connectDB", error);
        process.exit(1);
    }
}

module.exports = { getEnv, connectDB };
