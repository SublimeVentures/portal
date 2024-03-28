const cron = require("node-cron");
const logger = require("./logger");
const { fetchEnv } = require("../services/env");

function getRefreshRate() {
    const randomSecond = Math.floor(Math.random() * 59);
    const randomMinute = Math.floor(Math.random() * 30);

    return `${randomSecond} ${randomMinute} */3 * * *`;
}

async function initCron() {
    cron.schedule(getRefreshRate(), async () => {
        logger.info(`CRON :: [fetchEnv]`);
        await fetchEnv();
    });

    logger.warn("|---- Cron: OK");
}

module.exports = { initCron };
