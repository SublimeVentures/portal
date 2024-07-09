const cron = require("node-cron");
const { fetchEnv } = require("../services/env");
const { updateATH } = require("../services/database"); // Make sure this path is correct
const logger = require("./logger");

function getRefreshRate() {
    const randomSecond = Math.floor(Math.random() * 59);
    const randomMinute = Math.floor(Math.random() * 30);

    return `${randomSecond} ${randomMinute} */3 * * *`;
}

async function initCron() {
    // Existing cron job for fetchEnv
    cron.schedule(getRefreshRate(), async () => {
        logger.info(`CRON :: [fetchEnv]`);
        await fetchEnv();
    });

    // New cron job for updating the database daily at around 1 AM
    cron.schedule("0 1 * * *", async () => {
        logger.info(`CRON :: [updateATH]`);
        await updateATH();
    });
    logger.warn("|---- Cron: OK");
}

module.exports = { initCron };
