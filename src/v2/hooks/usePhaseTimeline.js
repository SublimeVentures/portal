import moment from "moment";
import { PhaseId, Phases } from "@/v2/lib/phases";
import { useMemo } from "react";

// Questions
// -> Should phases.sort function return phases from 1+ based on ids?
// -> Whale phase - Do we need to check isBasedVCTenant besided of isLaunchpad && lengthWhales values?
// -> Pending phase - I added it after whale phase. I'm not quite sure if it's applied correct though
// -> To clarify: fix existing phase rotation system - it's not refreshing on production or it takes extra long to refresh, it should be almost instant ie. at 23:59 and switch phase at 00:00 or 00:01 (the sooner the better). Currently it is switched like at 00:05

// Notes
// 1. Whales - Phase visible only for basedVc whale holders. they can fill only half of the progress bar. only whales can invest. Default users see pending phase
// 2. Pending - Last 6h 
// 3. Raffle - Ensured allocation for raffle winners. users can register during pending phase. last 24h
// 4, Open / 5. FCFS - User can invest. Last about 6h 

const createPhase = (phaseId, startDate = null) => ({ ...Phases[phaseId], startDate });

const whaleStrategy = (offer, phases) => {
    const { d_open, isLaunchpad, lengthWhales } = offer;
    if (!isLaunchpad && lengthWhales) {
        const startWhales = moment.unix(d_open).subtract(lengthWhales, "seconds");
        phases.push(createPhase(PhaseId.Whale, startWhales.unix()));
    };
};

const pendingStrategy = (_offer, phases) => phases.push(createPhase(PhaseId.Pending));

const raffleStrategy = (offer, phases) => {
    const { d_open, lengthRaffle, lengthWhales, isLaunchpad } = offer;
    if (lengthRaffle > 0) {
        const raffleStartOffset = lengthWhales && !isLaunchpad ? lengthWhales : 0;
        const startRaffle = moment.unix(d_open).subtract(raffleStartOffset + lengthRaffle, "seconds");
        phases.push(createPhase(PhaseId.Raffle, startRaffle.unix()));
    };
};

const openOrFCFSStrategy = (offer, phases) => {
    const { d_open, isLaunchpad } = offer;
    const phase = isLaunchpad ? PhaseId.Open : PhaseId.FCFS;
    phases.push(createPhase(phase, d_open));
};

const unlimitedSlowdownStrategy = (offer, phases) => {
    const { d_open, lengthFCFS, lengthUnlimitedSlowdown } = offer;
    if (lengthFCFS) {
        const startFCFS = moment.unix(d_open).add(lengthFCFS, "seconds");

        if (lengthUnlimitedSlowdown) {
            phases.push(createPhase(PhaseId.UnlimitedSlow, startFCFS.unix()));

            const startUnlimited = startFCFS.add(lengthUnlimitedSlowdown, "seconds");
            phases.push(createPhase(PhaseId.Unlimited, startUnlimited.unix()));
        } else {
            phases.push(createPhase(PhaseId.Unlimited, startFCFS.unix()));
        };
    };
};

const closedStrategy = (offer, phases) => phases.push(createPhase(PhaseId.Closed, offer.d_close));

export default function usePhaseTimeline(offer) {
    const phaseStrategies = [
        whaleStrategy,
        pendingStrategy,
        raffleStrategy,
        openOrFCFSStrategy,
        unlimitedSlowdownStrategy,
        closedStrategy,
    ];

    return useMemo(() => {
        const phases = [];
        phaseStrategies.forEach(strategy => strategy(offer, phases));

        return phases.sort((a, b) => a.startDate - b.startDate);
    }, [offer]);
};
