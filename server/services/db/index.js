const db = require("./definitions/db.init");
const logger = require("../../../src/lib/logger");
const { fetchEnv } = require("../env");

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

module.exports = { connectDB };
