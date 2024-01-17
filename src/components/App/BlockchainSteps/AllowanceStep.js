import {
    useReadContract,
    useSimulateContract,
    useWriteContract,
    useWaitForTransactionReceipt
} from 'wagmi'
import {blockchainRow, Transaction} from "@/components/App/BlockchainSteps/config";
import {useEffect, useState} from "react";
import {BigNumber} from "bignumber.js";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";
import {ICONS} from "@/lib/icons";
import {usdtAbi} from "../../../../abi/usdt.abi.js";
import { erc20Abi } from 'viem'

export default function AllowanceStep() {
    const [lastAllowance, setLastAllowance] = useState(0);
    const {activeChainCurrency, network} = useEnvironmentContext();
    const { blockchainProps, stepsIsReady, updateBlockchainProps } = useBlockchainContext();

    const {data, state, result} = blockchainProps

    const {allowance, account, currency, contract} = data
    const {allowance: isReady} = stepsIsReady
    const {isFinished, isError, error, readyToProcess} = state.allowance
    const {isFinished: liquidity_isFinished} = state.liquidity

    const currencyData = activeChainCurrency[currency]
    const isSpecialUSDT = currencyData?.symbol === 'USDT' && network.chainId === 1
    const abi = (currencyData?.symbol === 'USDT' && network.chainId === 1) ? usdtAbi : erc20Abi

    const balance_required = Number(allowance).toLocaleString()
    const power = BigNumber(10).pow(currencyData?.precision ? currencyData.precision : 0)
    const amount_bn = BigNumber(allowance).multipliedBy(power)
    const allowanceBN = allowance ? amount_bn : 0

    const allowanceCheckReady = isReady && !!currencyData?.address
    const {
        isSuccess: onchain_isSuccess,
        isLoading: onchain_isLoading,
        data: onchain_data,
        isError: onchain_isError,
        error: onchain_error,
        refetch: onchain_refetch,
    } = useReadContract(
        {
            address: currencyData?.address,
            abi: abi,
            functionName: 'allowance',
            args: [account, contract],
            enabled: allowanceCheckReady,
        }
    )


    ///SET ZERO FOR USDT
    const zeroSimEnabled = isReady && !isFinished && !!currencyData?.address && readyToProcess && isSpecialUSDT && !(result?.allowance?.amount===0)
    const {
        data: prep_configZero,
        isSuccess: prep_isSuccessZero,
        isError: prep_isErrorZero,
        error: prep_errorZero,
    } = useSimulateContract({
        address: currencyData?.address,
        abi: abi,
        functionName: 'approve',
        args: [contract, "0"],
        scopeKey: 'approvalZero',
        enabled: zeroSimEnabled,
    })

    const {
        data: write_dataZero,
        writeContract: write_sendZero,
        isError: write_isErrorZero,
        error: write_errorZero,
        isLoading: write_isLoadingZero,
    } = useWriteContract()


    const {
        data: confirmation_dataZero,
        isError: confirmation_isErrorZero,
        error: confirmation_errorZero,
        isSuccess: confirmation_isSuccessZero,
    } = useWaitForTransactionReceipt({
        confirmations: 1,
        hash: write_dataZero,
    })


    ///SET PROPER VALUE
    const valSimEnabled = isReady && !isFinished && !!currencyData?.address && (readyToProcess && (!isSpecialUSDT || (!!confirmation_dataZero || result?.allowance?.amount===0))) ? true : false
    const {
        data: prep_configValue,
        isSuccess: prep_isSuccessValue,
        isError: prep_isErrorValue,
        error: prep_errorValue,
    } = useSimulateContract({
        address: currencyData?.address,
        abi: abi,
        functionName: 'approve',
        args: [contract, allowanceBN],
        scopeKey: 'approvalSet',
        enabled: valSimEnabled
    })
    console.log("SIMS", {
        zeroSimEnabled,
        valSimEnabled
    })

    const {
        data: write_dataValue,
        writeContract: write_sendValue,
        isError: write_isErrorValue,
        error: write_errorValue,
        isLoading: write_isLoadingValue,
    } = useWriteContract()


    const {
        data: confirmation_dataValue,
        isError: confirmation_isErrorValue,
        error: confirmation_errorValue,
        isSuccess: confirmation_isSuccessValue,
    } = useWaitForTransactionReceipt({
        confirmations: 2,
        hash: write_dataValue,
    })

    const getCurrentAllowance = () => {
        if (onchain_data?.toString() != undefined && currencyData?.precision) {
            const power = BigNumber(10).pow(currencyData?.precision)
            const balance_currentBN = BigNumber(onchain_data)
            return onchain_data ? balance_currentBN.dividedBy(power).toNumber() : 0
        } else return 0
    }

    useEffect(() => {
        console.log("IQZ :: ALLOWANCE :: RUN", isReady)
        if (!isReady || isFinished || !onchain_isSuccess) return
        setLastAllowance(allowance)
        const allowance_current = getCurrentAllowance()
        console.log("IQZ :: ALLOWANCE : current", allowance_current)

        let updates = [
            { path: 'result.allowance.amount', value: allowance_current }
        ]
        if(allowance_current>=allowance) { //success - have approved allocation
            console.log("IQZ :: ALLOWANCE : set as success", allowance_current>=allowance, allowance_current,allowance)
            updates = [...updates, ...[
                {path: 'state.allowance.isError', value: false},
                {path: 'state.allowance.error', value: null},
                {path: 'state.allowance.isFinished', value: true},
                {path: 'state.allowance.readyToProcess', value: false},
                {path: 'result.allowance.confirmation', value: {
                        allowance_current,
                        allowance
                    }
                }
            ]]
        } else {
            updates.push({path: 'state.allowance.readyToProcess', value: true})
        }
        updateBlockchainProps(updates,"allowance ready & fetched")
    }, [
        onchain_data,
        isReady
    ])


    useEffect(() => {
        if(isFinished) return;
        console.log("IQZ :: ALLOWANCE : triggering reset entry", isReady && prep_isSuccessZero && !write_isLoadingZero && readyToProcess && isSpecialUSDT, !(result?.allowance?.amount===0))

        if (isReady && prep_isSuccessZero && !write_isLoadingZero && readyToProcess && isSpecialUSDT && !(result?.allowance?.amount===0)) {
            console.log("IQZ :: ALLOWANCE : triggering reset", zeroSimEnabled)

            updateBlockchainProps([
                { path: 'state.allowance.isError', value: false },
                { path: 'state.allowance.error', value: null }
            ], "allowance zero write start")
            if (!isFinished && Boolean(prep_configZero?.request)) {
                write_sendZero(prep_configZero?.request)
            }
        }
    }, [
        isReady,
        prep_isSuccessZero,
        readyToProcess
    ])


    useEffect(() => {
        if(isFinished) return;
        console.log("valSimEnabled - entering loop",isReady, prep_isSuccessValue, valSimEnabled, !write_isLoadingValue)

        console.log("IQZ :: ALLOWANCE : triggering set value entry", valSimEnabled)
        if (isReady && prep_isSuccessValue && !write_isLoadingValue && valSimEnabled) {
            console.log("IQZ :: ALLOWANCE : triggering set value", valSimEnabled)

            updateBlockchainProps([
                { path: 'state.allowance.isError', value: false },
                { path: 'state.allowance.error', value: null }
            ], "allowance zero write start")
            if (!isFinished && Boolean(prep_configValue?.request)) {
                write_sendValue(prep_configValue?.request)
            }
        }
    }, [
        isReady,
        prep_isSuccessValue,
        valSimEnabled
    ])


    useEffect(() => {
        console.log("IQZ :: ALLOWANCE : confirm submission", !!confirmation_dataValue && confirmation_isSuccessValue && !isFinished, !!confirmation_dataValue, confirmation_isSuccessValue, !isFinished)
        if(isFinished) return;
        onchain_refetch()
        if (!!confirmation_dataValue && confirmation_isSuccessValue && !isFinished) {

            const allowance_current = getCurrentAllowance()
            console.log("IQZ :: ALLOWANCE :setting as save", allowance_current)

            if(allowance_current>=allowance) {
                console.log("AS :: allowance finished")
                updateBlockchainProps([
                    { path: 'state.allowance.isError', value: false },
                    { path: 'state.allowance.error', value: null },
                    { path: 'state.allowance.isFinished', value: true },
                    { path: 'state.allowance.readyToProcess', value: false },
                    { path: 'result.allowance.confirmation', value: {
                            confirmation_isSuccessValue,
                            confirmation_dataValue
                        }
                    }
                ], "allowance confirmed on chain")
            }
        }
    }, [
        onchain_data,onchain_isLoading,
        confirmation_isSuccessZero, confirmation_dataZero,
        confirmation_dataValue,
    ])


    useEffect(() => {
        console.log("IQZ :: ALLOWANCE :: ERROR", {
            onchain_error, prep_errorZero , write_errorZero , confirmation_errorZero , prep_errorValue , write_errorValue , confirmation_errorValue
        })


        if (!!onchain_isError || !!prep_isErrorZero || !!write_isErrorZero || !!confirmation_isErrorZero || !!prep_isErrorValue || !!write_isErrorValue || !!confirmation_isErrorValue) {
            console.log("ERRRoR", zeroSimEnabled,valSimEnabled )
            let zeroIsError = null
            let zeroErrors = null
            if(zeroSimEnabled && !confirmation_dataZero) {
                zeroIsError = !!prep_isErrorZero || !!write_isErrorZero || !!confirmation_isErrorZero
                zeroErrors = prep_errorZero || write_errorZero || confirmation_errorZero
            }
            console.log("IQZ :: ALLOWANCE :: ERROR for zero", {zeroIsError, zeroErrors  })


            let valIsError = null
            let valErrors = null

            if(valSimEnabled && !confirmation_dataValue) {
                valIsError = !!prep_isErrorValue || !!write_isErrorValue || !!confirmation_isErrorValue
                valErrors= prep_errorValue || write_errorValue || confirmation_errorValue
            }
            console.log("IQZ :: ALLOWANCE :: ERROR for zero", {valIsError, valErrors  })

            if(onchain_isError ||  zeroIsError || valIsError) {
                console.log("IQZ :: ALLOWANCE :: ERROR entered", {onchain_isError, zeroIsError, valIsError}, {isError: onchain_isError ||  zeroIsError || valIsError, error: onchain_error || zeroErrors || valErrors})

                updateBlockchainProps([
                    { path: 'state.allowance.isError', value: onchain_isError ||  zeroIsError || valIsError},
                    // { path: 'state.allowance.isError', value: !!onchain_isError || !!prep_isErrorZero || !!write_isErrorZero || !!confirmation_isErrorZero || !!prep_isErrorValue || !!write_isErrorValue || !!confirmation_isErrorValue },
                    { path: 'state.allowance.error', value: onchain_error || zeroErrors || valErrors},
                    // { path: 'state.allowance.error', value: onchain_error || prep_errorZero || write_errorZero || confirmation_errorZero || prep_errorValue || write_errorValue || confirmation_errorValue },
                    { path: 'state.allowance.isFinished', value: false },
                    { path: 'state.allowance.readyToProcess', value: false },
                    { path: 'state.allowance.lock', value: true }
                ], "allowance errors")
            }

        }
    }, [
        onchain_isError,
        prep_isErrorZero,
        write_isErrorZero,
        confirmation_isErrorZero,
        prep_isErrorValue,
        write_isErrorValue,
        confirmation_isErrorValue,
        readyToProcess
    ])



    const iconPadding = "p-[7px]"

    if (isFinished) {
        const copy =  <>Allowance approved</>
        return blockchainRow(Transaction.Executed, copy, ICONS.KEY, iconPadding)
    }
    if (isError && !isFinished && liquidity_isFinished) {
        const copy = <span>Failed to set allowance for {currencyData.isSettlement ? `$${lastAllowance}` : `${lastAllowance} ${currencyData.symbol}`}</span>
        return blockchainRow(Transaction.Failed, copy, ICONS.KEY, iconPadding, error?.shortMessage)
    }
    if (!isReady) {
        return blockchainRow(Transaction.Waiting, <>Check allowance</>, ICONS.KEY, iconPadding)
    } else {
        const copy = <>Confirm allowance in wallet ({currencyData.isSettlement ? `$${balance_required}` : `${balance_required} ${currencyData.symbol}`})</>
        return blockchainRow(Transaction.Processing, copy, ICONS.KEY, iconPadding)
    }
}

