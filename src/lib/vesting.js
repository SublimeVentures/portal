import moment from "moment";

const SOON_DATE = 2592000;

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
            if (offerVesting[i].c === 0) break;
            if (offerVesting[i].c > now) {
                const unlockDateUnix = moment(
                    offerVesting[i].u,
                    "YYYY-MM-DD",
                ).unix();
                isSoon =
                    offerVesting[i].c - now <= SOON_DATE ||
                    offerVesting[i].s - now <= SOON_DATE ||
                    unlockDateUnix - now <= SOON_DATE;
                nextUnlock = offerVesting[i].u;
                nextSnapshot = moment
                    .unix(offerVesting[i].s)
                    .utc()
                    .local()
                    .format("YYYY-MM-DD mm:SS");
                nextClaim = moment
                    .unix(offerVesting[i].c)
                    .utc()
                    .local()
                    .format("YYYY-MM-DD mm:SS");

                if (now > unlockDateUnix && offerVesting[i].s !== 0) {
                    claimStage = STAGES.SNAPSHOT;
                } else if (now > offerVesting[i].s && offerVesting[i].c !== 0) {
                    claimStage = STAGES.CLAIM;
                }
                break;
            }
            vestedPercentage += offerVesting[i].p;
            payoutId = i + 1;
        }

        return {
            vestedPercentage,
            nextUnlock,
            nextSnapshot,
            nextClaim,
            isInstant: nextClaim == nextUnlock,
            isSoon,
            claimStage,
            payoutId,
        };
    }
}
