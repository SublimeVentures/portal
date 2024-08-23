export function timeUntilNextUnstakeWindow(stakedAt, staked) {
    if (!staked) return { unstake: false };

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const SECONDS_IN_A_DAY = 24 * 60 * 60;
    const SECONDS_IN_A_HOUR = 1 * 60 * 60;
    const PERIOD_LENGTH = 90 * SECONDS_IN_A_DAY; // 90 days in seconds
    const UNSTAKING_WINDOW_LENGTH = 3 * SECONDS_IN_A_DAY; // 3 days in seconds

    let timeSinceStaked = currentTimestamp - stakedAt;
    let periodPosition = timeSinceStaked % PERIOD_LENGTH;

    if (periodPosition >= PERIOD_LENGTH - UNSTAKING_WINDOW_LENGTH) {
        let timeUntilNextRestake = (PERIOD_LENGTH - periodPosition) / SECONDS_IN_A_DAY;
        let timeUntilNextRestakeHours = (PERIOD_LENGTH - periodPosition) / SECONDS_IN_A_HOUR;

        return {
            unstake: true,
            nextDate: timeUntilNextRestake.toFixed(0),
            nextDateH: timeUntilNextRestakeHours.toFixed(0),
        };
    } else {
        let timeUntilUnstakeWindow = (PERIOD_LENGTH - UNSTAKING_WINDOW_LENGTH - periodPosition) / SECONDS_IN_A_DAY;
        let timeUntilUnstakeWindowHours = (PERIOD_LENGTH - UNSTAKING_WINDOW_LENGTH - periodPosition) / SECONDS_IN_A_HOUR;

        return {
            unstake: false,
            nextDate: timeUntilUnstakeWindow.toFixed(0),
            nextDateH: timeUntilUnstakeWindowHours.toFixed(0),
        };
    };
};
