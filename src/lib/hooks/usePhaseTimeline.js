const moment = require("moment");
const { PhaseId, Phases } = require("./../phases");

const usePhaseTimeline = (offerDetails) => {
    const { d_open, d_close, isLaunchpad, lengthWhales, lengthRaffle, lengthFCFS, lengthUnlimitedSlowdown } =
        offerDetails;

    const phases = [];

    // Handle Whales phase for non-launchpad deals
    if (!isLaunchpad && lengthWhales) {
        const startWhales = moment.unix(d_open).subtract(lengthWhales, "seconds");
        phases.push({ ...Phases[PhaseId.Whale], phaseId: PhaseId.Whale, startDate: startWhales.unix() });
    }

    // Handle Raffle phase for all deals
    if (lengthRaffle) {
        const raffleStartOffset = lengthWhales && !isLaunchpad ? lengthWhales : 0;
        const startRaffle = moment.unix(d_open).subtract(raffleStartOffset + lengthRaffle, "seconds");
        phases.push({ ...Phases[PhaseId.Raffle], phaseId: PhaseId.Raffle, startDate: startRaffle.unix() });
    }

    // Specific opening phase based on deal type
    if (isLaunchpad) {
        phases.push({ ...Phases[PhaseId.Open], phaseId: PhaseId.Open, startDate: d_open });
    } else {
        phases.push({ ...Phases[PhaseId.FCFS], phaseId: PhaseId.FCFS, startDate: d_open });
    }

    // Handling FCFS and potential Unlimited Slowdown phase
    if (lengthFCFS) {
        const startFCFS = moment.unix(d_open).add(lengthFCFS, "seconds");
        if (lengthUnlimitedSlowdown) {
            phases.push({
                ...Phases[PhaseId.UnlimitedSlow],
                phaseId: PhaseId.UnlimitedSlow,
                startDate: startFCFS.unix(),
            });
            const startUnlimited = startFCFS.add(lengthUnlimitedSlowdown, "seconds");
            phases.push({ ...Phases[PhaseId.Unlimited], phaseId: PhaseId.Unlimited, startDate: startUnlimited.unix() });
        } else {
            phases.push({ ...Phases[PhaseId.Unlimited], phaseId: PhaseId.Unlimited, startDate: startFCFS.unix() });
        }
    }

    // Add the Closed phase
    phases.push({ ...Phases[PhaseId.Closed], phaseId: PhaseId.Closed, startDate: d_close });

    // Sort phases by startDate
    return phases.sort((a, b) => a.startDate - b.startDate);
};

export default usePhaseTimeline;
