import { useState, useMemo, useCallback } from "react";
import moment from "moment";
import useCurrentAndNextPhase from "./usePhaseInvestment";

const usePhaseInvestmentMemo = (phases, offerData) => {
    const [trigger, setTrigger] = useState(0);

    // Using useMemo to only recalculate the phases when either `phases` changes or a refresh is triggered
    const { phaseCurrent, phaseNext, offerClosed } = useMemo(() => {
        const now = moment().unix();

        return useCurrentAndNextPhase(phases, offerData, now);
    }, [phases, trigger, offerData?.isSettled]);

    // Function to force a refresh
    const phaseRefresh = useCallback(() => {
        setTrigger((oldTrigger) => oldTrigger + 1); // Change state to trigger re-computation
    }, []);

    return { phaseCurrent, phaseNext, offerClosed, phaseRefresh };
};

export default usePhaseInvestmentMemo;
