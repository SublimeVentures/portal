import React, {memo, useReducer, useEffect, useState, useMemo} from "react";
import useGetTokenBalance from "@/lib/hooks/useGetTokenBalance";
import {initialState, reducer} from "@/components/BlockchainInteraction/reducer";
import BlockchainStep from "@/components/BlockchainInteraction/BlockchainStep";
import {STEP_STATE, STEPS, StepsState} from "@/components/BlockchainInteraction/StepsState";
import useGetTokenAllowance from "@/lib/hooks/useGetTokenAllowance";
import {ETH_USDT, getMethod, getPrerequisite, METHOD} from "@/components/BlockchainInteraction/utils";
import useSendTransaction from "@/lib/hooks/useSendTransaction";
import {isBased} from "@/lib/utils";
import InteractStep from "@/components/App/BlockchainSteps/InteractStep";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import useBlockchainButton from "@/lib/hooks/useBlockchainButton";
import useGetNetwork from "@/lib/hooks/useGetNetwork";


const BlockchainInteraction = ({data}) => {
    const {steps, token, params} = data
    const [state, dispatch] = useReducer(reducer, initialState);
    console.log("BIX :: INIAITL:" ,data, token, state)

    useEffect(() => {
        console.log("BIX :: PARAM CHANGED", state, params)
        dispatch({ type: 'RESET'});
    }, [
        params.price,
        params.liquidity,
        params.allowance,
        params.amount,
        params.account,
        params.spender
    ]);

    const network_isReady = steps.network && !state.network.lock
    // const network_shouldRun =  network_isReady
    const network_shouldRun = !state.network.isFinished && network_isReady
    console.log("BIX :: NETWORK_CHECK - shouldRun / isReady",network_shouldRun,network_isReady)
    const network_current = useGetNetwork(network_shouldRun, params.requiredNetwork)
    const network_isFinished = network_current.isValid
    console.log(`BIX :: NETWORK_CHECK - RUN ${network_shouldRun}`,network_current, network_isFinished)
    useEffect(() => {
        if (network_shouldRun) {
            console.log(`BIX :: NETWORK_CHECK - SET - isFinished: ${network_isFinished} | REQUIRED: ${params.requiredNetwork } | CURRENT: ${ network_current.network}`)
            dispatch({ type: 'SET_NETWORK', payload: {network: network_current.network, chainId: network_current.chainId, isFinished: network_isFinished} });
        }
    }, [network_current.isValid, network_current?.network,network_shouldRun]);
    useEffect(() => {
        if(steps.network && !network_isFinished) {
            console.log(`BIX :: NETWORK_CHECK - RESET DUE TO NETWORK CHANGE`)
            dispatch({ type: 'RESET'});
        }
    }, [network_current?.network]);



    const liquidity_isReady = steps.network ? state.network.isFinished : steps.liquidity && !state.liquidity.lock
    const liquidity_shouldRun = !state.liquidity.isFinished && liquidity_isReady
    console.log("BIX :: LIQUIDITY - shouldRun / isReady",liquidity_shouldRun,liquidity_isReady)
    console.log("BIX :: LIQUIDITY - shouldRun split",state.liquidity.isFinished,liquidity_isReady)

    const liquidity_balance = useGetTokenBalance(liquidity_shouldRun, token)
    const liquidity_isFinished = params.liquidity <= liquidity_balance.balance
    console.log(`BIX :: LIQUIDITY - RUN ${liquidity_shouldRun}`,liquidity_balance.balance, liquidity_isFinished)
    useEffect(() => {
        if (liquidity_shouldRun) {
            console.log(`BIX :: LIQUIDITY - SET - isFinished: ${liquidity_isFinished} | LIQUIDITY: ${params.liquidity } | BALANCE: ${ liquidity_balance.balance}`)
            dispatch({ type: 'SET_LIQUIDITY', payload: {balance: liquidity_balance.balance, isFinished: liquidity_isFinished} });
        }
    }, [liquidity_balance.balance, liquidity_balance.fetchStatus]);



    const allowance_isReady = steps?.liquidity ? state.liquidity.isFinished : (steps?.network ? state.network.isFinished : true)
    const allowance_shouldRun = steps.allowance && !state.allowance.isFinished && !state.allowance.lock && allowance_isReady
    console.log("BIX :: ALLOWANCE - shouldRun / isReady",allowance_shouldRun,allowance_isReady)
    console.log("BIX :: ALLOWANCE - shouldRun split",steps.allowance,!state.allowance.isFinished, !state.allowance.lock,allowance_isReady)

    const allowance_current = useGetTokenAllowance(allowance_shouldRun, token, params.account, params.spender)
    const allowance_isFinished = params.allowance <= allowance_current.allowance
    console.log(`BIX :: ALLOWANCE CHECK - RUN ${allowance_shouldRun}`,allowance_current.allowance, allowance_isFinished)

    useEffect(() => {
        console.log("BIX :: ALLOWANCE CHECK - DETECTED", allowance_current.allowance)
        if (allowance_shouldRun) {
            console.log(`BIX :: ALLOWANCE CHECK - SET - isFinished: ${allowance_isFinished} | ALLOWANCE: ${params.allowance } | ALLOWANCE CURRENT: ${ allowance_current.allowance}`)
            dispatch({ type: 'SET_ALLOWANCE', payload: {current: allowance_current.allowance, isFinished: allowance_isFinished} });
        }
    }, [allowance_current.allowance, allowance_shouldRun]);


    const allowance_methodReset = useMemo(() => getMethod(METHOD.ALLOWANCE, token, {...params, allowance: 0}), [token.address, params.spender])
    const allowance_method = useMemo(() => getMethod(METHOD.ALLOWANCE, token, params), [token.address, params.spender, params.allowance])
    const allowance_method_error = (!allowance_methodReset.ok ? allowance_methodReset?.error : false) || (!allowance_method.ok ? allowance_method?.error : false)
    console.log("METHOD VALIDATION", {allowance_methodReset, allowance_method })

    const allowance_mustRun = allowance_shouldRun && allowance_current.isFetched && allowance_current.allowance < params.allowance
    const allowance_needReset = allowance_mustRun && allowance_current.allowance > 0 && token?.contract.toLowerCase() === ETH_USDT && allowance_methodReset.ok
    const allowance_needIncrease = !allowance_needReset && allowance_mustRun && allowance_method.ok

    console.log(`BIX :: ALLOWANCE CHANGE - GUARDS useSendTransaction`, {allowance_isReady, allowance_shouldRun, allowance_mustRun, allowance_needReset, allowance_needIncrease})

    const allowance_set_reset = useSendTransaction(allowance_needReset, allowance_methodReset.method)
    const allowance_set = useSendTransaction(allowance_needIncrease, allowance_method.method)
    console.log(`BIX :: ALLOWANCE CHANGE - HOOK STATE`, {allowance_set_reset, allowance_set,})


    const prerequisite_isReady = steps?.allowance ? state.allowance.isFinished : (steps?.liquidity ? state.liquidity.isFinished : (steps?.network ? state.network.isFinished : true))
    const prerequisite_shouldRun = steps.transaction && !state.prerequisite.isFinished && !state.prerequisite.lock && prerequisite_isReady
    console.log("BIX :: PREREQUISITE - shouldRun / isReady",prerequisite_shouldRun,prerequisite_isReady)
    useEffect(() => {
        if (prerequisite_shouldRun) {
            console.log(`BIX :: PREREQUISITE - SET - should run: ${prerequisite_shouldRun}`)

            getPrerequisite(params.transactionType, {...params, state, network: network_current}).then(result => {
                console.log(`BIX :: PREREQUISITE - SET - results for ${params.transactionType}`, result)
                if(result.ok) {
                    const transaction_method = getMethod(METHOD.OTC_MAKE, token, {...params, prerequisite: result.data})
                    console.log(`BIX :: PREREQUISITE - SET - transaction method`, transaction_method)
                    dispatch({
                            type: 'SET_PREREQUISITE',
                            payload: {
                                method: transaction_method.method || null,
                                isFinished: transaction_method?.ok || false,
                                error: transaction_method.error
                            }
                        });
                } else {
                    dispatch({
                        type: 'SET_PREREQUISITE',
                        payload: {
                            isFinished: false,
                            error: result.error,
                            method: null
                        }
                    });
                }
            })
        }
    }, [prerequisite_isReady]);


    const transaction_isReady = steps?.allowance ? state.allowance.isFinished : (steps?.liquidity ? state.liquidity.isFinished : (steps?.network ? state.network.isFinished : true))
    const transaction_shouldRun = steps.transaction && !state.transaction.isFinished && !state.transaction.lock && transaction_isReady && state.prerequisite.isFinished
    console.log("BIX :: TRANSACTION - shouldRun / isReady",transaction_shouldRun, transaction_isReady)
    console.log("BIX :: TRANSACTION - shouldRun split",steps.transaction, !state.transaction.isFinished, !state.transaction.lock, transaction_isReady, state.prerequisite.isFinished)
    const transaction = useSendTransaction(transaction_shouldRun, state.prerequisite.method  || {})
    console.log(`BIX :: TRANSACTION - HOOK STATE`, transaction)
    const transaction_isFinished = transaction.confirm?.data
    console.log(`BIX :: TRANSACTION - RUN`, transaction_isFinished)
    useEffect(() => {
        if (transaction_shouldRun) {
            console.log(`BIX :: TRANSACTION - SET - isFinished: `, transaction_isFinished)
            dispatch({ type: 'SET_TRANSACTION', result: transaction_isFinished });
        }
    }, [transaction_isFinished]);

    //todo: test prerequisite fail and retry
    //todo: fix handup on bad abi

    const stepNetwork = StepsState(STEPS.NETWORK, state.network, {...network_current, params, network_isReady,network_shouldRun, network_isFinished  })
    const stepLiquidity = StepsState(STEPS.LIQUIDITY, state.liquidity, {...liquidity_balance, token, params, liquidity_isFinished, liquidity_isReady })
    const stepAllowance = StepsState(STEPS.ALLOWANCE, state.allowance, {...allowance_current, token, params, allowance_isFinished, allowance_set_reset, allowance_set, allowance_isReady, allowance_method_error })
    const stepTransaction = StepsState(STEPS.TRANSACTION, state.transaction, {...transaction, token, params, transaction_isFinished, transaction_isReady, method_error: state.prerequisite.error })


    useEffect(() => {
        console.log(`BIX :: RESET STATE`, stepLiquidity.state, stepAllowance.state)

        if(stepNetwork.state === STEP_STATE.ERROR) {
            dispatch({ type: 'RESET_NETWORK'});
        }
        if(stepLiquidity.state === STEP_STATE.ERROR) {
            dispatch({ type: 'RESET_LIQUIDITY'});
        }
        if(stepAllowance.state === STEP_STATE.ERROR) {
            dispatch({ type: 'RESET_ALLOWANCE'});
        }
        if(stepTransaction.state === STEP_STATE.ERROR) {
            dispatch({ type: 'RESET_TRANSACTION'});
        }

    }, [
        stepNetwork.state,
        stepLiquidity.state,
        stepAllowance.state,
        stepTransaction.state
    ]);


    const extraState = {
        stepLiquidity,
    }

    const {buttonIcon, buttonLock, buttonText} = useBlockchainButton(steps, state, params, extraState)

    const runProcess = () => {
        dispatch({
            type: 'START',
            payload: {
                liquidity: !steps.liquidity,
                allowance: !steps.allowance,
            }
        });
    }

    console.log(`BIX :: RENDER STATE`, {stepLiquidity, stepAllowance})

    return (
        <>
            <div className="flex flex-col flex-1 pb-2 justify-content text-sm">
                <div className={"h-[50px] w-full flex items-center"}><div className={"w-full h-[1px] bg-outline opacity-30"}></div></div>

                {steps.network && <BlockchainStep data={stepNetwork}/>}
                {steps.liquidity && <BlockchainStep data={stepLiquidity}/>}
                {steps.allowance && <BlockchainStep data={stepAllowance}/>}
                {steps.transaction && <BlockchainStep data={stepTransaction}/>}
            </div>
            <div className={` pb-5 ${isBased ? "fullWidth" : " w-full fullBtn"}`}>
                <UniButton
                    type={ButtonTypes.BASE}
                    isWide={true}
                    size={'text-sm sm'}
                    state={"danger"}
                    icon={buttonIcon}
                    isDisabled={buttonLock}
                    text={buttonText}
                    handler={ () => {
                        runProcess()
                    }}/>
            </div>
        </>
    )
}

export default BlockchainInteraction;
