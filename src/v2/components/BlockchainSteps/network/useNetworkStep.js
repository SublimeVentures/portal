import { useEffect } from "react";
import { getStepState } from "../getStepState";
import { STEPS } from "../enums";
import { networkAction } from "./reducer";
import useGetNetwork from "@/lib/hooks/useGetNetwork";

export default function useNetworkStep(state, data, dispatch) {
    const { steps, params } = data;

    const network_isReady = steps.network && !state.network.lock;
    const network_shouldRun = !state.network.isFinished && network_isReady;
    const network_current = useGetNetwork(network_shouldRun, params.requiredNetwork);
    const network_isFinished = network_current.isValid;

    useEffect(() => {
        if (network_shouldRun) {
            dispatch({
                type: networkAction.SET_NETWORK,
                payload: {
                    network: network_current.network,
                    chainId: network_current.chainId,
                    isFinished: network_isFinished,
                },
            });
        }
    }, [network_current.isValid, network_current?.network, network_shouldRun]);

    return {
        network_current,
        stepNetwork: getStepState(STEPS.NETWORK, state.network, {
            ...network_current,
            params,
            network_isReady,
            network_shouldRun,
            network_isFinished,
        }),
    };
};
