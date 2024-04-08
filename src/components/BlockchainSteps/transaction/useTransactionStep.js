import { useEffect } from "react";
import { useChainId } from "wagmi";
import useSendTransaction from "@/lib/hooks/useSendTransaction";
import { transactionAction } from "./reducer";
import { getStepState } from "../getStepState";
import { STEPS } from "../enums";

export default function useTransactionStep(state, data, dispatch) {
    const chainId = useChainId();
    const { steps, token, params } = data;

    const transaction_isReady = steps.allowance
        ? state.allowance.isFinished
        : steps.liquidity
        ? state.liquidity.isFinished
        : steps.network
        ? state.network.isFinished
        : true;
    
    const transaction_shouldRun = steps.transaction && !state.transaction.isFinished && !state.transaction.lock && transaction_isReady && state.prerequisite.isFinished;
    const transaction = useSendTransaction(transaction_shouldRun, state.prerequisite.method || {}, chainId, params.account );

    const transaction_isFinished = transaction.confirm?.data?.transactionHash;

    useEffect(() => {
    if (transaction_shouldRun) {
        dispatch({
            type: transactionAction.SET_TRANSACTION,
            result: transaction_isFinished,
        });
    }
    }, [transaction_isFinished]);

    return {
        transaction,
        stepTransaction: getStepState(STEPS.TRANSACTION, state.transaction, {
            ...transaction,
            token,
            params,
            transaction_isFinished,
            transaction_isReady,
        })
    }
}
