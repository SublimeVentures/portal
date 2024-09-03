import { useState, useEffect, useMemo } from "react";
import moment from "moment";

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
}

export default function usePhaseInvestment(phases, offer) {
    const [phaseData, setPhaseData] = useState(() => calculatePhaseData(phases, offer));

    // My fix for:
    // fix existing phase rotation system - it's not refreshing on production or it takes extra long to refresh, it should be almost instant ie. at 23:59 and switch phase at 00:00 or 00:01 (the sooner the better). Currently it is switched like at 00:05
    // 
    // - Update on mount
    // - Update to the next phase with timeToNextPhase
    useEffect(() => {
        const updatePhase = () => {
            const newPhaseData = calculatePhaseData(phases, offer);
            if (JSON.stringify(newPhaseData) !== JSON.stringify(phaseData)) setPhaseData(newPhaseData);
        }

        updatePhase();

        const now = moment.utc();
        const nextPhaseStart = moment.unix(phaseData.phaseNext.startDate);
        const timeToNextPhase = nextPhaseStart.diff(now);

        const timeoutId = setTimeout(() => updatePhase(), timeToNextPhase);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [phases, offer, phaseData]);

    return useMemo(() => phaseData, [phaseData]);
};
