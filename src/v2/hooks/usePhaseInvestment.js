import { useState, useEffect, useMemo, useCallback } from "react";
import moment from "moment";

import { useOfferDetailsQuery } from "@/v2/modules/offer/queries";
import usePhaseTimeline from "./usePhaseTimeline";

const processPhases = (phases, isSettled) => {
    const now = moment.utc().unix();
    let activeId;

    if (isSettled) {
        activeId = phases.length - 1;
    } else {
        activeId = phases.findLastIndex(phase => now > phase.startDate);
        if (activeId === -1) activeId = 0;
    }

    return {
        phases,
        activeId,
        isLast: phases.length - 1 === activeId,
    };
}

const calculatePhaseData = (phases, offer) => {
    const data = processPhases(phases, offer.isSettled);

    return {
        phases: data.phases,
        isClosed: (!!data.phases && data.isLast) || offer.isSettled,
        phaseCurrent: data.phases[data.activeId],
        phaseNext: data.isLast ? data.phases[data.activeId] : data.phases[data.activeId + 1],
    };
};

export default function usePhaseInvestment() {
    const phases = usePhaseTimeline();
    const { data: offer } = useOfferDetailsQuery();

    const [phaseData, setPhaseData] = useState(() => calculatePhaseData(phases, offer));

    const updatePhase = useCallback(() => {
        const newPhaseData = calculatePhaseData(phases, offer);
        if (JSON.stringify(newPhaseData) !== JSON.stringify(phaseData)) {
            setPhaseData(newPhaseData);
        }
    }, [phases, offer, phaseData]);

    useEffect(() => {
        // Update on mount
        updatePhase();

        // Update to the next phase with timeToNextPhase
        const now = moment.utc();
        const nextPhaseStart = moment.unix(phaseData.phaseNext?.startDate).add(10, 'milliseconds');
        const timeToNextPhase = nextPhaseStart.diff(now);

        const timeoutId = setTimeout(() => updatePhase(), timeToNextPhase);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [phaseData, updatePhase]);

    return useMemo(() => ({
        ...phaseData,
        updatePhase,
    }), [phaseData, updatePhase]);
};
