import { useMemo } from "react";
import usePhaseTimeline from "./usePhaseTimeline";

const usePhaseTimelineMemo = (offerDetails) => {
    return useMemo(() => {
        return usePhaseTimeline(offerDetails);
    }, [offerDetails]);
};

export default usePhaseTimelineMemo;
