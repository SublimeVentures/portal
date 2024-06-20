import { useEffect, useReducer, useCallback } from "react";
import { useChainId } from "wagmi";
import debounce from "lodash.debounce";

import { mainReducer, initialState, stepsAction } from "./reducer";
import useNetworkStep, { networkAction } from "./network";
import useLiquidityStep, { liquidityAction } from "./liquidity";
import useAllowanceStep, { allowanceAction } from "./allowance";
import usePrerequisiteStep, { prerequisiteAction } from "./prerequisite";
import useTransactionStep, { transactionAction } from "./transaction";
import useBlockchainButton from "@/lib/hooks/useBlockchainButton";
import { STEP_STATE } from "./enums";

const defaultState = Object.freeze({
    content: "Analyser Tool",
    description: "This will guide you through each step for a seamless purchase",
})

export default function useBlockchainStep({ data }) {
    const chainId = useChainId();
    const { steps, token, params, setTransactionSuccessful } = data;
    const [state, dispatch] = useReducer(mainReducer, initialState);

    useEffect(() => {
        dispatch({ type: stepsAction.RESET });
        resetState();
    }, [
        params.price,
        params.liquidity,
        params.allowance,
        params.amount,
        params.account,
        params.spender,
        params.contract,
        params.isSeller,
        params.otcId,
        params?.offerDetails?.otcId,
        params?.offerDetails?.dealId,
        chainId,
        token?.contract,
    ]);

    const { stepNetwork, network_current } = useNetworkStep(state, data, dispatch);
    const { stepLiquidity } = useLiquidityStep(state, data, dispatch);
    const { stepAllowance, allowance_set_reset, allowance_set } = useAllowanceStep(state, data, dispatch);
    const { stepPrerequisite } = usePrerequisiteStep(state, data, network_current, dispatch);
    const { stepTransaction, transaction } = useTransactionStep(state, data, dispatch);

    const resetState = () => {
        console.log("BIX :: PARAM CHANGED - reset writers");
        allowance_set_reset.write?.reset();
        allowance_set.write?.reset();
        transaction.write?.reset();
    };

    const runProcess = () => {
        resetState();
        dispatch({ type: stepsAction.START });
    };

    const debouncedRunProcess = useCallback(
        debounce(runProcess, 500, {
            leading: true,
            trailing: false,
        }),
        [],
    );

    useEffect(() => {
        console.log(
            `BIX :: RESET STATE`,
            stepNetwork.state,
            stepLiquidity.state,
            stepAllowance.state,
            stepTransaction.state,
        );

        if (steps.network && stepNetwork.state === STEP_STATE.ERROR) {
            dispatch({ type: networkAction.RESET_NETWORK });
        }
        if (steps.liquidity && stepLiquidity.state === STEP_STATE.ERROR) {
            dispatch({ type: liquidityAction.RESET_LIQUIDITY });
        }
        if (steps.allowance && stepAllowance.state === STEP_STATE.ERROR) {
            dispatch({ type: allowanceAction.RESET_ALLOWANCE });
            transaction.write?.reset();
        }
        if (stepPrerequisite.state === STEP_STATE.ERROR) {
            dispatch({ type: prerequisiteAction.RESET_PREREQUISITE });
            transaction.write?.reset();
        }
        if (steps.transaction && stepTransaction.state === STEP_STATE.ERROR) {
            dispatch({ type: transactionAction.RESET_TRANSACTION });
        }
    }, [stepNetwork.state, stepLiquidity.state, stepAllowance.state, stepPrerequisite.state, stepTransaction.state]);

    useEffect(() => {
        if (stepTransaction.transaction_isFinished) {
            console.log("BIX :: TRANSACTION FINALIZED - transaction_isFinished");
            setTransactionSuccessful(stepTransaction.transaction_isFinished);
        }
    }, [stepTransaction.transaction_isFinished]);

    const extraState = {
        stepNetwork,
        stepLiquidity,
        stepAllowance,
        stepPrerequisite,
        stepTransaction,
    };

    const buttonState = useBlockchainButton(steps, state, params, extraState);

    // @TODO - Refactor, maybe put it in useBlockchainButton?
    const states = Object.values(extraState).map(({ state }) => state);
    const processingState = Object.keys(extraState).find(key => extraState[key].state === STEP_STATE.PROCESSING);
    const isProcessing = states.includes(STEP_STATE.PROCESSING);
    const isSuccess = states.every(state => state === STEP_STATE.SUCCESS);
    const hasError = states.includes(STEP_STATE.ERROR);

    const currentState = extraState[processingState] ?? defaultState;

    return {
        resetState,
        getBlockchainStepsProps: () => ({
            status: state.status,
            currentState,
            extraState,
            steps,
        }),
        getBlockchainStepButtonProps: () => ({
            run: debouncedRunProcess,
            status: state.status,
            ...buttonState,
        })
    };
};
