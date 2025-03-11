import { TENANT } from "../../../lib/tenantHelper";

export function TENANTS_STAKIMG() {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return [];
        }
        case TENANT.NeoTokyo: {
            return ["S1", "S2"];
        }
        case TENANT.CyberKongz: {
            return ["Genesis Kong", "Baby Kong"];
        }
        case TENANT.BAYC: {
            return ["BAYC", "MAYC"];
        }
    }
}

export function timeUntilNextUnstakeWindow(stakedAt, staked, stakeLength, stakeWithdraw) {
    if (!staked)
        return {
            unstake: false,
        };
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const SECONDS_IN_A_DAY = 24 * 60 * 60;
    const SECONDS_IN_A_HOUR = 1 * 60 * 60;
    const PERIOD_LENGTH = stakeLength ? stakeLength : 90 * SECONDS_IN_A_DAY; // default 90 days in seconds
    const UNSTAKING_WINDOW_LENGTH = stakeWithdraw ? stakeWithdraw : 3 * SECONDS_IN_A_DAY; // default 3 days in seconds

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
        let timeUntilUnstakeWindowHours =
            (PERIOD_LENGTH - UNSTAKING_WINDOW_LENGTH - periodPosition) / SECONDS_IN_A_HOUR;
        return {
            unstake: false,
            nextDate: timeUntilUnstakeWindow.toFixed(0),
            nextDateH: timeUntilUnstakeWindowHours.toFixed(0),
        };
    }
}
