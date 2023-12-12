import {erc20ABI, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'
import {getIcon, getStatusColor, Transaction} from "@/components/App/BlockchainSteps/config";
import {useEffect} from "react";
import {BigNumber} from "bignumber.js";
import {useState} from "react";

export default function AllowanceStep({stepProps}) {
    const {
        processingData,
        isReady,
        setIsReady,
        isFinished,
        setFinished,
        saveData
    } = stepProps

    const {
        amountAllowance,
        userWallet,
        currency,
        diamond
    } = processingData

    const [processing, setProcessing] = useState(false)


    const power = BigNumber(10).pow(currency.precision)
    const amount_bn = BigNumber(amountAllowance).multipliedBy(power)
    const requiredAllowance = amountAllowance ? amount_bn : 0

    const {
        isLoading: isLoadingRead,
        // isFetching: isFetchingRead,
        // isSuccess: isSuccessRead,
        // isFetched: isFetchedRead,
        data: allowance
    } = useContractRead(
        {
            address: currency.address,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [userWallet, diamond],
            watch: !isFinished,
        }
    )

    const {config, isSuccess: isSuccessConfig, isError: isErrorConfig} = usePrepareContractWrite({
        address: currency.address,
        abi: erc20ABI,
        functionName: 'approve',
        args: [diamond, requiredAllowance],
        enabled: isReady && !isFinished,
    })

    const {
        data: allowanceData,
        write,
        isError: isErrorWrite,
        // isSuccess: isSuccessWrite,
        isLoading: isLoadingWrite,
    } = useContractWrite(config)


    const {
        isError: isErrorPending,
        // data: confirmationData,
        // isSuccess: isSuccessPending,
        isLoading: isLoadingPending,
        // isFetching: isFetchingPending
    } = useWaitForTransaction({
        confirmations: 2,
        hash: allowanceData?.hash,
    })


    const allowance_bn = BigNumber(allowance ? allowance : 0).div(power)
    const allowanceHuman = (allowance ? allowance_bn.toNumber() : 0)
    const isEnoughAllowance = amountAllowance <= allowanceHuman
    const amountLocale = Number(amountAllowance).toLocaleString()
    const allowanceLocale = Number(allowanceHuman).toLocaleString()
    console.log("AllowanceStep - debug", isReady,isFinished, isEnoughAllowance, isSuccessConfig )


    const setAllowance = () => {
        console.log("AllowanceStep - trigger", !processing ,isReady, !isLoadingWrite, isSuccessConfig, !isEnoughAllowance )

        if (!processing && isReady && !isLoadingWrite && isSuccessConfig) {
            setProcessing(true)
            if(!isEnoughAllowance) {
                console.log("AllowanceStep - debug trigger")
                write()
            }
        }
    }

    useEffect(() => {
        setAllowance()
    }, [isReady, isSuccessConfig, processing])


    useEffect(() => {
        console.log("AllowanceStep - enough", isEnoughAllowance ,isReady)

        if(isEnoughAllowance && isReady) {
            setFinished(true)
        }
        if(!isReady) {
            setFinished(false)
        }
    }, [isEnoughAllowance, isReady])

    useEffect(() => {
        if(isErrorWrite || isErrorPending) {
            console.log("AllowanceStep - trigger - disable isReady")
            setIsReady(false)
            if(isSuccessConfig) {
                setProcessing(false)
            }
            setFinished(false)
        }
    }, [isErrorWrite, isErrorPending])


    useEffect(() => {
        if(isSuccessConfig) {
            setIsReady(true)
        }
    }, [isSuccessConfig])

    useEffect(() => {
        saveData({
            isEnoughAllowance,
            allowanceHuman
        })
    }, [isEnoughAllowance, allowanceHuman])



    const statuses = (state) => {
        switch (state) {
            case Transaction.Waiting: {
                return <>Check allowance</>
            }
            case Transaction.Processing: {
                return <>Getting allowance
                    for {currency.isSettlement ? `$${amountLocale}` : `${amountLocale} ${currency.symbol}`}</>
            }
            case Transaction.Executed: {
                return <>Allowance confirmed
                    ({currency.isSettlement ? `$${amountLocale}` : `${amountLocale} ${currency.symbol}`}) </>
            }
            case Transaction.Failed: {
                return <span
                    className="underline">Failed to set allowance for {currency.isSettlement ? `$${amountLocale}` : `${amountLocale} ${currency.symbol}`}</span>
            }
            default: {
                return <>Check allowance</>
            }
        }
    }

    const prepareRow = (state) => {
        return <div className={`flex flex-row items-center ${getStatusColor(state)}`}
                    onClick={() => setAllowance(state)}>
            {getIcon(state)}
            <div>
                {statuses(state)}
                {state !== Transaction.Executed && <div className="text-xs -mt-1">current
                    allowance: {currency.isSettlement ? `$${allowanceLocale}` : `${allowanceLocale} ${currency.symbol}`}</div>}
            </div>
        </div>
    }


    if (isFinished && isEnoughAllowance) {
        return prepareRow(Transaction.Executed)
    }
    if (isSuccessConfig && (isErrorWrite || isErrorPending)) {
        return prepareRow(Transaction.Failed)
    }
    if (!isReady && !isLoadingWrite && !isLoadingPending && !isLoadingRead) {
        return prepareRow(Transaction.Waiting)
    } else {
        return prepareRow(Transaction.Processing)
    }


}

