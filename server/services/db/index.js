const db = require("./definitions/db.init");
const { getEnvironment } = require("../../queries/environment.query");
const logger = require("../../../src/lib/logger");
let env = {};

function getEnv() {
    return env;
}

async function connectDB() {
    try {
        await db.authenticate();
        logger.info("|---- DB: connected");
        env = await getEnvironment();
        logger.info("|---- ENV: ", env);
    } catch (error) {
        logger.error("connectDB", error);
        process.exit(1);
    }
}

module.exports = { getEnv, connectDB };
