import { useEffect } from "react";
import { useChainId } from "wagmi";
import { getStepState } from "../getStepState";
import { STEPS } from "../enums";
import { transactionAction } from "./reducer";
import useSendTransaction from "@/lib/hooks/useSendTransaction";

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

    const transaction_shouldRun =
        steps.transaction &&
        !state.transaction.isFinished &&
        !state.transaction.lock &&
        transaction_isReady &&
        state.prerequisite.isFinished;

    console.log("BIX :: TRANSACTION - shouldRun / isReady", transaction_shouldRun, transaction_isReady);

    console.log(
        "BIX :: TRANSACTION - shouldRun split",
        steps.transaction,
        !state.transaction.isFinished,
        !state.transaction.lock,
        transaction_isReady,
        state.prerequisite.isFinished,
    );

    const transaction = useSendTransaction(
        transaction_shouldRun,
        state.prerequisite.method || {},
        chainId,
        params.account,
    );

    console.log(`BIX :: TRANSACTION - HOOK STATE`, transaction);

    const transaction_isFinished = transaction.confirm?.data?.transactionHash;
    console.log(`BIX :: TRANSACTION - RUN`, transaction_isFinished);

    useEffect(() => {
        if (transaction_shouldRun) {
            console.log(`BIX :: TRANSACTION - SET - isFinished: `, transaction_isFinished);

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
        }),
    };
}
