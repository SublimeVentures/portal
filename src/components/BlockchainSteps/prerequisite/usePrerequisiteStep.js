import { useEffect } from "react";
import useGetPrerequisite from "@/lib/hooks/useGetPrerequisite";
import { prerequisiteAction } from "./reducer";
import { getStepState } from "../getStepState";
import { STEPS } from "../enums";

export default function usePrerequisiteStep(state, data, network_current, dispatch) {
    const { steps, token, params } = data;

    const prerequisite_isReady = steps.allowance
        ? state.allowance.isFinished
        : steps?.liquidity
        ? state.liquidity.isFinished
        : steps.network
        ? state.network.isFinished
        : true;

    const prerequisite_shouldRun = steps.transaction && !state.prerequisite.isFinished && !state.prerequisite.lock && prerequisite_isReady;
        
    const prerequisite = useGetPrerequisite(prerequisite_shouldRun, { ...params, network: network_current }, state, token);

    useEffect(() => {
        if (prerequisite_shouldRun) {
            dispatch({
                type: prerequisiteAction.SET_PREREQUISITE,
                payload: {
                    method: prerequisite.method,
                    extra: prerequisite.extra,
                    isFinished: prerequisite.isFinished,
                },
            });
        }
    }, [prerequisite.isFinished, prerequisite_shouldRun]);

    return {
        stepPrerequisite: getStepState(STEPS.PREREQUISITE, state.prerequisite, {
            ...prerequisite,
            token,
            params,
            prerequisite_isReady,
        })
    }
}
