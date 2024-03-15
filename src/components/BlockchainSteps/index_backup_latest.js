import React, { useReducer, useEffect, useCallback } from "react";
import BlockchainStep from "@/components/BlockchainSteps/BlockchainStep";
import { initialState, reducer } from "@/components/BlockchainSteps/reducer";
import {
    STEP_STATE,
    STEPS,
    StepsState,
} from "@/components/BlockchainSteps/StepsState";
import {
    ETH_USDT,
    getMethod,
    METHOD,
} from "@/components/BlockchainSteps/utils";
import useGetNetwork from "@/lib/hooks/useGetNetwork";
import useGetTokenBalance from "@/lib/hooks/useGetTokenBalance";
import useGetTokenAllowance from "@/lib/hooks/useGetTokenAllowance";
import useSendTransaction from "@/lib/hooks/useSendTransaction";
import useBlockchainButton from "@/lib/hooks/useBlockchainButton";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { isBased } from "@/lib/utils";
import debounce from "lodash/debounce";
import useGetPrerequisite from "@/lib/hooks/useGetPrerequisite";
import { useChainId } from "wagmi";

const BlockchainSteps = ({ data }) => {
    const chainId = useChainId();
    const { steps, token, params, setTransactionSuccessful } = data;
    const [state, dispatch] = useReducer(reducer, initialState);
    console.log("BIX :: INIAITL:", data, token, state);

    useEffect(() => {
        console.log(
            "BIX :: PARAM CHANGED HIXKFHERYDDDD [reset] - ",
            state,
            params,
        );
        dispatch({ type: "RESET" });
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

    const network_isReady = steps.network && !state.network.lock;
    const network_shouldRun = !state.network.isFinished && network_isReady;
    console.log(
        "BIX :: NETWORK_CHECK - shouldRun / isReady",
        network_shouldRun,
        network_isReady,
    );
    const network_current = useGetNetwork(
        network_shouldRun,
        params.requiredNetwork,
    );
    const network_isFinished = network_current.isValid;
    console.log(
        `BIX :: NETWORK_CHECK - RUN ${network_shouldRun}`,
        network_current,
        network_isFinished,
    );
    useEffect(() => {
        if (network_shouldRun) {
            console.log(
                `BIX :: NETWORK_CHECK - SET - isFinished: ${network_isFinished} | REQUIRED: ${params.requiredNetwork} | CURRENT: ${network_current.network}`,
            );
            dispatch({
                type: "SET_NETWORK",
                payload: {
                    network: network_current.network,
                    chainId: network_current.chainId,
                    isFinished: network_isFinished,
                },
            });
        }
    }, [network_current.isValid, network_current?.network, network_shouldRun]);

    const liquidity_isReady =
        steps.liquidity &&
        (steps.network ? state.network.isFinished : !state.liquidity.lock);
    const liquidity_shouldRun =
        !state.liquidity.isFinished && liquidity_isReady;
    console.log(
        "BIX :: LIQUIDITY - shouldRun / isReady",
        liquidity_shouldRun,
        liquidity_isReady,
    );
    console.log(
        "BIX :: LIQUIDITY - shouldRun split",
        state.liquidity.isFinished,
        liquidity_isReady,
    );
    console.log(
        "BIX :: LIQUIDITY - isReady split",
        state.liquidity.isFinished,
        liquidity_isReady,
    );

    const liquidity_balance = useGetTokenBalance(
        liquidity_shouldRun,
        token,
        chainId,
        params.account,
        !steps.liquidity,
    );
    const liquidity_isFinished = params.liquidity <= liquidity_balance?.balance;
    console.log(
        `BIX :: LIQUIDITY - RUN ${liquidity_shouldRun}`,
        liquidity_balance?.balance,
        liquidity_isFinished,
    );
    useEffect(() => {
        if (liquidity_shouldRun) {
            console.log(
                `BIX :: LIQUIDITY - SET - isFinished: ${liquidity_isFinished} | LIQUIDITY: ${params.liquidity} | BALANCE: ${liquidity_balance.balance}`,
            );
            dispatch({
                type: "SET_LIQUIDITY",
                payload: {
                    balance: liquidity_balance.balance,
                    isFinished: liquidity_isFinished,
                },
            });
        }
    }, [liquidity_balance?.balance, liquidity_balance?.fetchStatus]);

    const allowance_isReady = steps?.liquidity
        ? state.liquidity.isFinished
        : steps?.network
          ? state.network.isFinished
          : true;
    const allowance_shouldRun =
        steps.allowance &&
        !state.allowance.isFinished &&
        !state.allowance.lock &&
        allowance_isReady;
    console.log(
        "BIX :: ALLOWANCE - shouldRun / isReady",
        allowance_shouldRun,
        allowance_isReady,
    );
    console.log(
        "BIX :: ALLOWANCE - shouldRun split",
        steps.allowance,
        !state.allowance.isFinished,
        !state.allowance.lock,
        allowance_isReady,
    );

    const allowance_current = useGetTokenAllowance(
        allowance_shouldRun,
        token,
        params.account,
        params.spender,
        chainId,
        !steps.allowance,
    );
    const allowance_mustRun =
        allowance_shouldRun &&
        allowance_current.isFetched &&
        allowance_current.allowance < params.allowance;

    const allowance_methodReset = steps.allowance
        ? getMethod(METHOD.ALLOWANCE, token, {
              ...params,
              allowance: 0,
              chainId,
          })
        : { method: { stop: true } };
    const allowance_method = steps.allowance
        ? getMethod(METHOD.ALLOWANCE, token, { ...params, chainId })
        : { method: { stop: true } };
    const allowance_method_error =
        (!allowance_methodReset.ok ? allowance_methodReset?.error : false) ||
        (!allowance_method.ok ? allowance_method?.error : false);
    console.log("METHOD VALIDATION HIXKFHERYDDDD", {
        allowance_methodReset,
        allowance_method,
    });

    const allowance_needReset =
        allowance_mustRun &&
        allowance_current.allowance > 0 &&
        token?.contract.toLowerCase() === ETH_USDT &&
        allowance_methodReset.ok;
    const allowance_needIncrease =
        !allowance_needReset && allowance_mustRun && allowance_method.ok;
    useEffect(() => {
        console.log(
            "BIX :: ALLOWANCE CHECK - DETECTED",
            allowance_current?.allowance,
        );
        if (allowance_needIncrease) {
            dispatch({ type: "SET_ALLOWANCE_SET", payload: true });
        }
    }, [allowance_needIncrease]);
    console.log(`BIX :: ALLOWANCE CHANGE - GUARDS useSendTransaction`, {
        allowance_isReady,
        allowance_shouldRun,
        allowance_mustRun,
        allowance_needReset,
        allowance_needIncrease,
    });

    const allowance_set_reset = useSendTransaction(
        allowance_needReset,
        allowance_methodReset.method,
        chainId,
        params.account,
    );
    const allowance_set = useSendTransaction(
        allowance_needIncrease,
        allowance_method.method,
        chainId,
        params.account,
    );
    console.log(`BIX :: HIXKFHERYDDDD ALLOWANCE CHANGE - HOOK STATE`, {
        allowance_set_reset,
        allowance_set,
    });
    const allowance_isFinished =
        (!allowance_mustRun &&
            !state.allowance.executing &&
            params.allowance <= allowance_current?.allowance) ||
        (state.allowance.executing &&
            allowance_set?.confirm?.data &&
            params.allowance <= allowance_current?.allowance);
    console.log(
        `BIX :: HIXKFHERYDDDD ALLOWANCE CHECK - RUN ${allowance_shouldRun}`,
        allowance_current?.allowance,
        allowance_isFinished,
        !allowance_mustRun &&
            !state.allowance.executing &&
            params.allowance <= allowance_current?.allowance,
        state.allowance.executing &&
            allowance_set?.confirm?.data &&
            params.allowance <= allowance_current?.allowance,
    );

    useEffect(() => {
        console.log(
            "BIX :: ALLOWANCE CHECK - DETECTED",
            allowance_current?.allowance,
        );
        if (allowance_shouldRun) {
            console.log(
                `BIX :: ALLOWANCE CHECK - SET - isFinished: ${allowance_isFinished} | ALLOWANCE: ${params.allowance} | ALLOWANCE CURRENT: ${allowance_current?.allowance}`,
            );
            dispatch({
                type: "SET_ALLOWANCE",
                payload: {
                    current: allowance_current?.allowance,
                    isFinished: allowance_isFinished,
                },
            });
        }
    }, [
        allowance_current?.allowance,
        allowance_shouldRun,
        allowance_set?.confirm?.data,
    ]);

    const prerequisite_isReady = steps.allowance
        ? state.allowance.isFinished
        : steps?.liquidity
          ? state.liquidity.isFinished
          : steps.network
            ? state.network.isFinished
            : true;
    const prerequisite_shouldRun =
        steps.transaction &&
        !state.prerequisite.isFinished &&
        !state.prerequisite.lock &&
        prerequisite_isReady;
    const prerequisite = useGetPrerequisite(
        prerequisite_shouldRun,
        { ...params, network: network_current },
        state,
        token,
    );

    console.log(
        "BIX :: PREREQUISITE - shouldRun / isReady",
        prerequisite_shouldRun,
        prerequisite_isReady,
    );
    useEffect(() => {
        if (prerequisite_shouldRun) {
            console.log(
                `BIX :: PREREQUISITE - SET - should run: ${prerequisite_shouldRun}`,
            );
            dispatch({
                type: "SET_PREREQUISITE",
                payload: {
                    method: prerequisite.method,
                    extra: prerequisite.extra,
                    isFinished: prerequisite.isFinished,
                },
            });
        }
    }, [prerequisite.isFinished, prerequisite_shouldRun]);

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
    console.log(
        "BIX :: TRANSACTION - shouldRun / isReady",
        transaction_shouldRun,
        transaction_isReady,
    );
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
            console.log(
                `BIX :: TRANSACTION - SET - isFinished: `,
                transaction_isFinished,
            );
            dispatch({
                type: "SET_TRANSACTION",
                result: transaction_isFinished,
            });
        }
    }, [transaction_isFinished]);

    const stepNetwork = StepsState(STEPS.NETWORK, state.network, {
        ...network_current,
        params,
        network_isReady,
        network_shouldRun,
        network_isFinished,
    });
    const stepLiquidity = StepsState(STEPS.LIQUIDITY, state.liquidity, {
        ...liquidity_balance,
        token,
        params,
        liquidity_isFinished,
        liquidity_isReady,
    });
    const stepAllowance = StepsState(STEPS.ALLOWANCE, state.allowance, {
        ...allowance_current,
        token,
        params,
        allowance_isFinished,
        allowance_set_reset,
        allowance_set,
        allowance_isReady,
        allowance_method_error,
        allowance_shouldRun,
    });
    const stepPrerequisite = StepsState(
        STEPS.PREREQUISITE,
        state.prerequisite,
        { ...prerequisite, token, params, prerequisite_isReady },
    );
    const stepTransaction = StepsState(STEPS.TRANSACTION, state.transaction, {
        ...transaction,
        token,
        params,
        transaction_isFinished,
        transaction_isReady,
    });

    const resetState = () => {
        console.log("BIX :: PARAM CHANGED - reset writers");
        allowance_set_reset.write?.reset();
        allowance_set.write?.reset();
        transaction.write?.reset();
    };

    const runProcess = () => {
        resetState();
        dispatch({ type: "START" });
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
            dispatch({ type: "RESET_NETWORK" });
        }
        if (steps.liquidity && stepLiquidity.state === STEP_STATE.ERROR) {
            dispatch({ type: "RESET_LIQUIDITY" });
        }
        if (steps.allowance && stepAllowance.state === STEP_STATE.ERROR) {
            dispatch({ type: "RESET_ALLOWANCE" });
            transaction.write?.reset();
        }
        if (stepPrerequisite.state === STEP_STATE.ERROR) {
            dispatch({ type: "RESET_PREREQUISITE" });
            transaction.write?.reset();
        }
        if (steps.transaction && stepTransaction.state === STEP_STATE.ERROR) {
            dispatch({ type: "RESET_TRANSACTION" });
            if (
                stepTransaction.error.text == "Signature expired" ||
                stepTransaction.error.text == "Invalid signature"
            ) {
                console.log("bad sign");
                dispatch({ type: "RESET_PREREQUISITE" });
                transaction.write?.reset();
            }
        }
    }, [
        stepNetwork.state,
        stepLiquidity.state,
        stepAllowance.state,
        stepPrerequisite.state,
        stepTransaction.state,
    ]);

    useEffect(() => {
        if (!!transaction_isFinished) {
            console.log(
                "BIX :: TRANSACTION FINALIZED - transaction_isFinished",
            );
            setTransactionSuccessful(transaction_isFinished);
        }
    }, [transaction_isFinished]);

    const extraState = {
        stepNetwork,
        stepLiquidity,
        stepAllowance,
        stepPrerequisite,
        stepTransaction,
    };

    const { buttonIcon, buttonLock, buttonText } = useBlockchainButton(
        steps,
        state,
        params,
        extraState,
    );

    console.log(`BIX :: RENDER STATE`, extraState);

    return (
        <>
            <div className="flex flex-col flex-1 pb-5 justify-content text-sm">
                <div className={"h-[50px] w-full flex items-center"}>
                    <div
                        className={"w-full h-[1px] bg-outline opacity-30"}
                    ></div>
                </div>
                {steps.network && <BlockchainStep data={stepNetwork} />}
                {steps.liquidity && <BlockchainStep data={stepLiquidity} />}
                {steps.allowance && <BlockchainStep data={stepAllowance} />}
                {steps.transaction && (
                    <BlockchainStep data={stepPrerequisite} />
                )}
                {steps.transaction && <BlockchainStep data={stepTransaction} />}
            </div>
            <div
                className={` pb-5 ${isBased ? "fullWidth" : " w-full fullBtn"}`}
            >
                <UniButton
                    type={ButtonTypes.BASE}
                    isWide={true}
                    size={"text-sm sm"}
                    state={"danger"}
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
