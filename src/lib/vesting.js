import moment from "moment";

const THREE_DAYS_IN_SECONDS = 259200;
const MONTH_IN_SECONDS = THREE_DAYS_IN_SECONDS * 10;

export const STAGES = {
    UNLOCK: 1,
    SNAPSHOT: 2,
    CLAIM: 3,
};

export function parseVesting(offerVesting) {
    if (!offerVesting || offerVesting.length === 0) {
        return {
            vestedPercentage: 0,
            nextUnlock: 0,
            nextSnapshot: 0,
            nextClaim: 0,
        };
    } else {
        const now = moment().unix();
        let vestedPercentage = 0;
        let nextUnlock = 0;
        let nextSnapshot = 0;
        let nextClaim = 0;
        let payoutId = 0;
        let isSoon = false;
        let claimStage = STAGES.UNLOCK;

        for (let i = 0; i < offerVesting.length; i++) {
            const vesting = offerVesting[i];
            if (vesting.claimDate === 0) break;
            if (vesting.claimDate > now) {
                const unlockDateUnix = moment(vesting.unlockDate, "YYYY-MM-DD").unix();
                isSoon =
                    vesting.claimDate - now <= THREE_DAYS_IN_SECONDS ||
                    vesting.snapshotDate - now <= THREE_DAYS_IN_SECONDS ||
                    unlockDateUnix - now <= MONTH_IN_SECONDS;
                nextUnlock = vesting.unlockDate;
                nextSnapshot = moment.unix(vesting.snapshotDate).utc().local().format("YYYY-MM-DD mm:SS");
                nextClaim = moment.unix(vesting.claimDate).utc().local().format("YYYY-MM-DD mm:SS");

                if (now > unlockDateUnix && vesting.snapshotDate !== 0) {
                    claimStage = STAGES.SNAPSHOT;
                } else if (now > vesting.snapshotDate && vesting.claimDate !== 0) {
                    claimStage = STAGES.CLAIM;
                }
                break;
            }
            vestedPercentage += vesting.percentage;
            payoutId = i + 1;
        }

        return {
            vestedPercentage,
            nextUnlock,
            nextSnapshot,
            nextClaim,
            isInstant: nextClaim === nextUnlock,
            isSoon,
            claimStage,
            payoutId,
        };
    }
}
