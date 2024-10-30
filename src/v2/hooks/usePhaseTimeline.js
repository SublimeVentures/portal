import { useMemo } from "react";
import moment from "moment";

import { useOfferDetailsQuery } from "@/v2/modules/offer/queries";
import { PhaseId, Phases } from "@/v2/lib/phases";

// Mocked values for phases testing purposes
// const targetDate = moment("2024-09-17 14:00", "YYYY-MM-DD HH:mm"), countStart = targetDate.unix(), duration = 500000;
// const useOfferDetailsQuery = () => ({ data: {
//     d_open: countStart,
//     isLaunchpad: false,
//     lengthWhales: duration,
//     lengthRaffle: duration,
//     lengthFCFS: duration,
//     lengthUnlimitedSlowdown: duration,
//     d_close: moment.unix(countStart).add(6 * duration, "seconds").unix(),
// }});

// Notes
// 1. Whales - Phase visible only for basedVc whale holders. they can fill only half of the progress bar. only whales can invest. Default users see pending phase
// 2. Pending - Last 6h
// 3. Raffle - Ensured allocation for raffle winners. users can register during pending phase. last 24h
// 4, Open / 5. FCFS - User can invest. Last about 6h

// - tiery sa przetrzymwane w session, na tej podstawie decydowane jest co beda userzy widzeieli
// - raffle - jesli jest wlaczony, to w trakcie pending moga sie zapisac
// fcfs vs open
// - fcfs - maksymalna inwestycja z danych z session
// - open - bezposrednio z offer - offerFundraise / offerDetails - alloMax - zhardcodowana max wartosc

const createPhase = (phaseId, startDate = null) => ({ ...Phases[phaseId], startDate });

const whaleStrategy = (offer, phases) => {
    const { d_open, isLaunchpad, lengthWhales } = offer;
    if (!isLaunchpad && lengthWhales) {
        const startWhales = moment.unix(d_open).subtract(lengthWhales, "seconds");
        phases.push(createPhase(PhaseId.Whale, startWhales.unix()));
    }
};

const pendingStrategy = (_offer, phases) => phases.push(createPhase(PhaseId.Pending));

const raffleStrategy = (offer, phases) => {
    const { d_open, lengthRaffle, lengthWhales, isLaunchpad } = offer;
    if (lengthRaffle > 0) {
        const raffleStartOffset = lengthWhales && !isLaunchpad ? lengthWhales : 0;
        const startRaffle = moment.unix(d_open).subtract(raffleStartOffset + lengthRaffle, "seconds");
        phases.push(createPhase(PhaseId.Raffle, startRaffle.unix()));
    }
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
        }
    }
};

const closedStrategy = (offer, phases) => phases.push(createPhase(PhaseId.Closed, offer.d_close));

export default function usePhaseTimeline() {
    const { data } = useOfferDetailsQuery();

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
        phaseStrategies.forEach((strategy) => strategy(data, phases));

        return phases.sort((a, b) => a.startDate - b.startDate);
    }, [data]);
}
