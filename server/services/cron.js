const cron = require("node-cron");
const { getEnvironment } = require("../queries/environment.query");

let scheduledTask = null;

function getRefreshRate() {
    const randomSecond = Math.floor(Math.random() * 59);
    const randomMinute = Math.floor(Math.random() * 30);

    return `${randomSecond} ${randomMinute} */3 * * *`;
}

async function scheduleUpdateEnv(env) {
    if (scheduledTask) scheduledTask.stop();

    scheduledTask = cron.schedule(getRefreshRate(), async () => {
        env = await getEnvironment();
    });
}

module.exports = { scheduleUpdateEnv };
