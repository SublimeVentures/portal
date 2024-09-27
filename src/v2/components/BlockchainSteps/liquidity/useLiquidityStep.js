import { useEffect } from "react";
import { useChainId } from "wagmi";
import { getStepState } from "../getStepState";
import { STEPS } from "../enums";
import { liquidityAction } from "./reducer";
import useGetTokenBalance from "@/lib/hooks/useGetTokenBalance";

export default function useLiquidityStep(state, data, dispatch) {
    const chainId = useChainId();
    const { steps, token, params } = data;

    const liquidity_isReady = !!steps.liquidity && (!!steps.network ? state.network.isFinished : !state.liquidity.lock);
    const liquidity_shouldRun = !state.liquidity.isFinished && liquidity_isReady;

    const liquidity_balance = useGetTokenBalance(liquidity_shouldRun, token, chainId, params.account, !steps.liquidity);
    const liquidity_isFinished = params.liquidity <= liquidity_balance?.balance;

    useEffect(() => {
        if (liquidity_shouldRun) {
            dispatch({
                type: liquidityAction.SET_LIQUIDITY,
                payload: {
                    balance: liquidity_balance.balance,
                    isFinished: liquidity_isFinished,
                },
            });
        }
    }, [liquidity_balance?.balance, liquidity_balance?.fetchStatus]);

    return {
        stepLiquidity: getStepState(STEPS.LIQUIDITY, state.liquidity, {
            ...liquidity_balance,
            token,
            params,
            liquidity_isFinished,
            liquidity_isReady,
        }),
    };
};
