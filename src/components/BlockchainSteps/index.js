import React, { useEffect, useReducer, useCallback } from "react";
import { useChainId } from "wagmi";
import debounce from "lodash.debounce";

import { stepsReducer, initialState, stepsAction } from "./reducer";
import useNetworkStep, { networkAction } from "./network";
import useLiquidityStep, { liquidityAction } from "./liquidity";
import useAllowanceStep, { allowanceAction } from "./allowance";
import usePrerequisiteStep, { prerequisiteAction } from "./prerequisite";
import useTransactionStep, { transactionAction } from "./transaction";
import { STEP_STATE } from "./enums";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import useBlockchainButton from "@/lib/hooks/useBlockchainButton";
import BlockchainStep from "@/components/BlockchainSteps/BlockchainStep";

const BlockchainSteps = ({ data }) => {
    const chainId = useChainId();
    const { steps, token, params, setTransactionSuccessful } = data;
    const [state, dispatch] = useReducer(stepsReducer, initialState);

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

    const { buttonIcon, buttonLock, buttonText } = useBlockchainButton(steps, state, params, extraState);

    return (
        <>
            <div className="flex flex-col flex-1 pb-5 justify-content text-sm">
                <div className={"h-[50px] w-full flex items-center"}>
                    <div className={"w-full h-[1px] bg-outline opacity-30"}></div>
                </div>

                {steps.network && <BlockchainStep data={stepNetwork} />}
                {steps.liquidity && <BlockchainStep data={stepLiquidity} />}
                {steps.allowance && <BlockchainStep data={stepAllowance} />}
                {steps.transaction && <BlockchainStep data={stepPrerequisite} />}
                {steps.transaction && <BlockchainStep data={stepTransaction} />}
            </div>

            <div className="pb-5 button-container">
                <UniButton
                    type={ButtonTypes.BASE}
                    isWide={true}
                    size="text-sm sm"
                    state="danger"
                    icon={buttonIcon}
                    isDisabled={buttonLock}
                    text={buttonText}
                    handler={debouncedRunProcess}
                />
            </div>
        </>
    );
};

export default BlockchainSteps;
