import { useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { getStepState } from "../getStepState";
import { STEPS } from "../enums";
import { allowanceAction } from "./reducer";
import { ETH_USDT, getMethod, METHOD } from "@/v2/components/BlockchainSteps/utils";
import useSendTransaction from "@/lib/hooks/useSendTransaction";
import useGetTokenAllowance from "@/lib/hooks/useGetTokenAllowance";

export default function useAllowanceStep(state, data, dispatch) {
    const chainId = useChainId();
    const { steps, token, params } = data;
    let [isNew, setIsNew] = useState(true);

    const allowance_isReady = steps?.liquidity
        ? state.liquidity.isFinished
        : steps?.network
          ? state.network.isFinished
          : true;

    const allowance_shouldRun =
        steps?.allowance && !state.allowance.isFinished && !state.allowance.lock && allowance_isReady;

    const allowance_current = useGetTokenAllowance(
        allowance_shouldRun,
        token,
        params.account,
        params.spender,
        chainId,
        !steps.allowance,
    );

    const allowance_mustRun =
        isNew && allowance_shouldRun && allowance_current.isFetched && allowance_current.allowance < params.allowance;

    const allowance_methodReset = steps.allowance
        ? getMethod(METHOD.ALLOWANCE, token, { ...params, allowance: 0, chainId })
        : { method: { stop: true } };

    const allowance_method = steps.allowance
        ? getMethod(METHOD.ALLOWANCE, token, { ...params, chainId })
        : { method: { stop: true } };

    const allowance_method_error =
        (!allowance_methodReset.ok ? allowance_methodReset?.error : false) ||
        (!allowance_method.ok ? allowance_method?.error : false);

    const allowance_needReset =
        allowance_mustRun &&
        allowance_current.allowance > 0 &&
        token?.contract.toLowerCase() === ETH_USDT.toLowerCase() &&
        allowance_methodReset.ok;
    const allowance_needIncrease = !allowance_needReset && !!allowance_mustRun && !!allowance_method.ok;

    const allowance_set_reset = useSendTransaction(
        allowance_needReset,
        allowance_methodReset.method,
        chainId,
        params.account,
    );

    const allowance_set = useSendTransaction(allowance_needIncrease, allowance_method.method, chainId, params.account);

    const allowance_isFinished =
        (!allowance_mustRun && !state.allowance.executing && params.allowance <= allowance_current?.allowance) ||
        (state.allowance.executing &&
            !!allowance_set?.confirm?.data &&
            params.allowance <= allowance_current?.allowance);

    // useEffect(() => {
    //     if (allowance_isFinished) return;

    //     const interval = setInterval(() => {
    //         if (allowance_current?.allowance >= params.allowance) {
    //             clearInterval(interval);
    //         } else {
    //             setIsNew((value) => !value);
    //         }
    //     }, 500);

    //     return () => clearInterval(interval);
    // }, [allowance_current, params.allowance, allowance_isFinished, allowance_set_reset, allowance_set]);

    useEffect(() => {
        if (allowance_shouldRun) {
            dispatch({
                type: allowanceAction.SET_ALLOWANCE,
                payload: {
                    current: allowance_current.allowance,
                    isFinished: allowance_isFinished,
                },
            });
        }
    }, [allowance_current?.allowance, allowance_shouldRun, allowance_set?.confirm?.data]);

    useEffect(() => {
        if (allowance_needIncrease) {
            dispatch({ type: allowanceAction.SET_ALLOWANCE_SET, payload: true });
        }
    }, [allowance_needIncrease, dispatch]);

    return {
        allowance_set_reset,
        allowance_set,
        stepAllowance: getStepState(STEPS.ALLOWANCE, state.allowance, {
            ...allowance_current,
            token,
            params,
            allowance_isFinished,
            allowance_set_reset,
            allowance_set,
            allowance_isReady,
            allowance_method_error,
            allowance_shouldRun,
        }),
    };
}
