import React, {memo, useReducer, useEffect, useState, useMemo} from "react";
import useGetTokenBalance from "@/lib/hooks/useGetTokenBalance";
import {initialState, reducer} from "@/components/BlockchainInteraction/reducer";
import BlockchainStep from "@/components/BlockchainInteraction/BlockchainStep";
import {STEPS, StepsState} from "@/components/BlockchainInteraction/StepsState";
import useGetTokenAllowance from "@/lib/hooks/useGetTokenAllowance";
import {ETH_USDT, getMethod, getPrerequisite, METHOD} from "@/components/BlockchainInteraction/utils";
import useSendTransaction from "@/lib/hooks/useSendTransaction";


const BlockchainInteraction = ({data}) => {
    const {steps, token, params} = data
    const [state, dispatch] = useReducer(reducer, initialState);
    console.log("BIX",data, token)

    const liquidity_isReady = true
    const liquidity_shouldRun = steps.liquidity && !state.liquidity.isFinished && liquidity_isReady
    const liquidity_balance = useGetTokenBalance(liquidity_shouldRun, token)
    console.log(`BIX :: LIQUIDITY - SHOULD RUN ${liquidity_shouldRun}`, liquidity_balance)

    useEffect(() => {
        // if (liquidity_shouldRun) {
        if (liquidity_balance) {
            const isFinished = params.liquidity <= liquidity_balance.balance
            console.log(`BIX :: SET LIQUIDITY - isFinished: ${isFinished} | LIQUIDITY: ${params.liquidity } | BALANCE: ${ liquidity_balance.balance}`)
            dispatch({ type: 'SET_LIQUIDITY', payload: {balance: liquidity_balance.balance, isFinished} });
        }
    }, [liquidity_balance.balance]);


    const allowance_isReady = steps?.liquidity ? state.liquidity.isFinished : true
    const allowance_shouldRun = steps.allowance && !state.allowance.isFinished && allowance_isReady
    const allowance_current = useGetTokenAllowance(allowance_shouldRun, token, params.account, params.contract)
    console.log(`BIX :: ALLOWANCE CHECK - SHOULD RUN ${allowance_shouldRun}`, allowance_current.allowance)
    useEffect(() => {
        // if (allowance_shouldRun) {
        if (allowance_current) {
            const isFinished = params.allowance <= allowance_current.allowance
            console.log(`BIX :: ALLOWANCE CHECK SET - isFinished: ${isFinished} | LIQUIDITY: ${params.allowance } | ALLOWANCE: ${ allowance_current.allowance}`)
            dispatch({ type: 'SET_ALLOWANCE', payload: {current: allowance_current.allowance, isFinished} });
        }
    }, [allowance_current.allowance]);


    const allowance_methodReset = useMemo(() => getMethod(METHOD.ALLOWANCE, token, {...params, allowance: 0}), [token.address, params.allowance])
    const allowance_method = useMemo(() => getMethod(METHOD.ALLOWANCE, token, params), [token.address, params.allowance])

    // const allowance_required = allowance_current.isFetched && allowance_current.allowance < params.allowance
    // const allowance_needReset = allowance_required && allowance_current.allowance > 0 && token?.contract.toLowerCase() === ETH_USDT && allowance_methodReset.ok
    // const allowance_needIncrease = !allowance_needReset && allowance_required && allowance_method.ok

    const allowance_needReset = false && token?.contract.toLowerCase() === ETH_USDT && allowance_methodReset.ok
    const allowance_needIncrease = !allowance_needReset && true && allowance_method.ok

    // // //todo getMethod verif error handling
    // //
    console.log(`BIX :: ALLOWANCE SET - SHOULD RUN ${true}`, {allowance_needReset,allowance_needIncrease, allowance_method})
    // //
    // // const allowance_set_reset = useSendTransaction(allowance_needReset, allowance_methodReset.method)
    const allowance_set = useSendTransaction(allowance_needIncrease, allowance_method.method)
    // console.log(`BIX :: ALLOWANCE SET - HOOK`, {allowance_set_reset,allowance_set})



    const prerequisite_isReady = steps?.allowance ? state.allowance.isFinished : (steps?.liquidity ? state.allowance.isFinished : true)

    useEffect(() => {
        if (prerequisite_isReady && !state.prerequisite.isFinished) {
            getPrerequisite(params.transactionType, params).then(result => {
                if(result.ok) {
                    const transaction_method = getMethod(METHOD.OTC_MAKE, token, params)
                    dispatch({
                            type: 'SET_PREREQUISITE',
                            payload: {
                                method: transaction_method.method,
                                isFinished: transaction_method.ok
                            }
                        });
                }
                // else {
                    // dispatch({ type: 'SET_ALLOWANCE', result: result });
                // }
            })
            // dispatch({ type: 'SET_ALLOWANCE', payload: {current: allowance_current.allowance, isFinished} });
        }
    }, [prerequisite_isReady]);

    const transaction_shouldRun = steps.transaction && !state.transaction.isFinished && state.prerequisite.isFinished

    const stepLiquidity = StepsState(STEPS.LIQUIDITY, state.liquidity, {...liquidity_balance, token})
    const stepAllowance = StepsState(STEPS.ALLOWANCE, state.allowance, {...allowance_current, token, params})
    console.log("stepLiquidity",stepLiquidity, {...liquidity_balance, token})



    return (
        <>
            <div className="flex flex-col flex-1 pb-2 justify-content text-sm">
                <div className={"h-[50px] w-full flex items-center"}><div className={"w-full h-[1px] bg-outline opacity-30"}></div></div>

                {steps.liquidity && <BlockchainStep data={stepLiquidity}/>}
                {steps.allowance && <BlockchainStep data={stepAllowance}/>}
            </div>

        </>
    )
}

export default BlockchainInteraction;
