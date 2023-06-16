const db = require('./db.setup');
const {getEnvironment} = require("../../queries/environment.query");
const Sentry = require("@sentry/nextjs");
let env = {}


function getEnv () {
    return env
}

async function connectDB() {
    try {
        await db.authenticate();
        // await db.sync({alter: true});
        // await db.sync();
        console.log("|---- DB: connected")
        env = await getEnvironment()
        console.log("|---- ENV: ", env)
    } catch (error) {
        Sentry.captureException({location: "connectDB", error});
        console.error("DB connection failed.", error);
        process.exit(1);
    }
}

module.exports = { getEnv, connectDB };
