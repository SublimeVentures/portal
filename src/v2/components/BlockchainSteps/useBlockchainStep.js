import { useEffect, useReducer, useCallback } from "react";
import { useChainId } from "wagmi";
import debounce from "lodash.debounce";

import { mainReducer, initialState } from "./reducer";
import useNetworkStep, { networkAction } from "./network";
import useLiquidityStep, { liquidityAction } from "./liquidity";
import useAllowanceStep, { allowanceAction } from "./allowance";
import usePrerequisiteStep, { prerequisiteAction } from "./prerequisite";
import useTransactionStep, { transactionAction } from "./transaction";
import { STEPS_ACTIONS, STEPS_STATE } from "./enums";
import { getTextContent } from "./helpers";
import useBlockchainButton from "@/lib/hooks/useBlockchainButton";

export default function useBlockchainStep({ data, deps = [] }) {
    const chainId = useChainId();
    const { steps, token, params, setTransactionSuccessful } = data;
    const [state, dispatch] = useReducer(mainReducer, initialState);

    useEffect(() => {
        dispatch({ type: STEPS_ACTIONS.RESET });
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
        ...deps,
    ]);

    const { stepNetwork, network_current } = useNetworkStep(state, data, dispatch);
    const { stepLiquidity } = useLiquidityStep(state, data, dispatch);
    const { stepAllowance, allowance_set_reset, allowance_set } = useAllowanceStep(state, data, dispatch);
    const { stepPrerequisite } = usePrerequisiteStep(state, data, network_current, dispatch);
    const { stepTransaction, transaction, transaction_isFinished } = useTransactionStep(state, data, dispatch);

    const resetState = () => {
        console.log("BIX :: PARAM CHANGED - reset writers");
        allowance_set_reset?.write?.reset();
        allowance_set?.write?.reset();
        transaction?.write?.reset();
    };

    const runProcess = () => {
        resetState();
        dispatch({ type: STEPS_ACTIONS.START });
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

        if (steps?.network && stepNetwork?.state === STEPS_STATE.ERROR) {
            dispatch({ type: networkAction.RESET_NETWORK });
        }
        if (steps?.liquidity && stepLiquidity?.state === STEPS_STATE.ERROR) {
            dispatch({ type: liquidityAction.RESET_LIQUIDITY });
        }
        if (steps?.allowance && stepAllowance?.state === STEPS_STATE.ERROR) {
            dispatch({ type: allowanceAction.RESET_ALLOWANCE });
            transaction.write?.reset();
        }
        if (stepPrerequisite?.state === STEPS_STATE.ERROR) {
            dispatch({ type: prerequisiteAction.RESET_PREREQUISITE });
            transaction.write?.reset();
        }
        if (steps?.transaction && stepTransaction?.state === STEPS_STATE.ERROR) {
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
    }, [transaction_isFinished]);

    const extraState = {
        stepNetwork,
        stepLiquidity,
        stepAllowance,
        stepPrerequisite,
        stepTransaction,
    };

    const buttonState = useBlockchainButton(steps, state, params, extraState);
    const content = getTextContent(extraState);

    const statuses = Object.values(extraState)
        .map((item) => item?.state)
        .filter(Boolean);
    const isProcessing = statuses.includes(STEPS_STATE.PROCESSING);
    const isSuccess = statuses.length > 0 && statuses.every((state) => state === STEPS_STATE.SUCCESS);
    const isError = statuses.includes(STEPS_STATE.ERROR);

    useEffect(() => {
        if (isProcessing) dispatch({ type: STEPS_ACTIONS.PROCESSING });
        if (isSuccess) dispatch({ type: STEPS_ACTIONS.SUCCESS });
        if (isError) dispatch({ type: STEPS_ACTIONS.ERROR });
    }, [isError, isProcessing, isSuccess]);

    return {
        resetState,
        getBlockchainStepsProps: () => ({
            content,
            steps,
            status: state.status,
            extraState,
        }),
        getBlockchainStepButtonProps: () => ({
            run: debouncedRunProcess,
            ...buttonState,
        }),
    };
}
