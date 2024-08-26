import { useEffect, useReducer, useCallback } from "react";
import { useChainId } from "wagmi";
import debounce from "lodash.debounce";

import { mainReducer, initialState, stepsAction } from "./reducer";
import useNetworkStep, { networkAction } from "./network";
import useLiquidityStep, { liquidityAction } from "./liquidity";
import useAllowanceStep, { allowanceAction } from "./allowance";
import usePrerequisiteStep, { prerequisiteAction } from "./prerequisite";
import useTransactionStep, { transactionAction } from "./transaction";
import { STEP_STATE } from "./enums";
import useBlockchainButton from "@/lib/hooks/useBlockchainButton";

const defaultState = Object.freeze({
    content: "Analyser Tool",
    description: "This will guide you through each step for a seamless purchase",
});

export default function useBlockchainStep({ data }) {
    const chainId = useChainId();
    const { steps, token, params, setTransactionSuccessful } = data;
    const [state, dispatch] = useReducer(mainReducer, initialState);

    const {
        price,
        liquidity,
        allowance,
        amount,
        account,
        spender,
        contract,
        isSeller,
        otcId,
        offerDetails = {},
    } = params;

    useEffect(() => {
        dispatch({ type: stepsAction.RESET });
        resetState();
    }, [
        price,
        liquidity,
        allowance,
        amount,
        account,
        spender,
        contract,
        isSeller,
        otcId,
        offerDetails?.otcId,
        offerDetails?.dealId,
        chainId,
        token?.contract,
    ]);

    const { stepNetwork, network_current } = useNetworkStep(!!steps.network, state, data, dispatch);
    const { stepLiquidity } = useLiquidityStep(!!steps.liquidity, state, data, dispatch);
    const { stepAllowance, allowance_set_reset, allowance_set } = useAllowanceStep(
        !!steps.allowance,
        state,
        data,
        dispatch,
    );
    const { stepPrerequisite } = usePrerequisiteStep(state, data, network_current, dispatch);
    const { stepTransaction, transaction } = useTransactionStep(!!steps.transaction, state, data, dispatch);

    const resetState = () => {
        console.log("BIX :: PARAM CHANGED - reset writers");
        allowance_set_reset?.write?.reset();
        allowance_set?.write?.reset();
        transaction?.write?.reset();
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
            stepNetwork?.state,
            stepLiquidity?.state,
            stepAllowance?.state,
            stepTransaction?.state,
        );

        if (steps?.network && stepNetwork?.state === STEP_STATE.ERROR) {
            dispatch({ type: networkAction.RESET_NETWORK });
        }
        if (steps?.liquidity && stepLiquidity?.state === STEP_STATE.ERROR) {
            dispatch({ type: liquidityAction.RESET_LIQUIDITY });
        }
        if (steps?.allowance && stepAllowance?.state === STEP_STATE.ERROR) {
            dispatch({ type: allowanceAction.RESET_ALLOWANCE });
            transaction.write?.reset();
        }
        if (stepPrerequisite?.state === STEP_STATE.ERROR) {
            dispatch({ type: prerequisiteAction.RESET_PREREQUISITE });
            transaction.write?.reset();
        }
        if (steps?.transaction && stepTransaction?.state === STEP_STATE.ERROR) {
            dispatch({ type: transactionAction.RESET_TRANSACTION });
        }
    }, [
        stepNetwork?.state,
        stepLiquidity?.state,
        stepAllowance?.state,
        stepPrerequisite?.state,
        stepTransaction?.state,
    ]);

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
    const statuses = Object.values(extraState)
        .map((item) => item?.state)
        .filter(Boolean);
    const processingState = Object.keys(extraState).find((key) => extraState[key]?.state === STEP_STATE.PROCESSING);
    const errorState = extraState[Object.keys(extraState).find((key) => extraState[key].state === STEP_STATE.ERROR)];
    const isProcessing = statuses.includes(STEP_STATE.PROCESSING);
    const isSuccess = statuses.every((state) => state === STEP_STATE.SUCCESS);
    const hasError = statuses.includes(STEP_STATE.ERROR);

    useEffect(() => {
        if (hasError) dispatch({ type: stepsAction.ERROR });
        if (isSuccess) dispatch({ type: stepsAction.SUCCESS });
        if (isProcessing) dispatch({ type: stepsAction.PROCESSING });
    }, [hasError, isProcessing, isSuccess]);

    const currentState = extraState[processingState] ?? defaultState;

    return {
        resetState,
        getBlockchainStepsProps: () => ({
            status: state.status,
            errorState,
            currentState,
            extraState,
            steps,
        }),
        getBlockchainStepButtonProps: () => ({
            run: debouncedRunProcess,
            status: state.status,
            ...buttonState,
        }),
    };
}
