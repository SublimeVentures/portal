import {erc20ABI, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'
import {useSession} from "next-auth/react";
import {getIcon, getStatusColor, Transaction} from "@/components/App/Transactions/TransactionSteps";
import {useEffect, useState} from "react";

export default function AllowanceStep({stepProps}) {
    const {amount, selectedCurrency, spender, stepAllowanceFinished: stepAllowance, setStepAllowance, stepAllowanceReady} = stepProps

    const {data: session} = useSession()

    const {config, isSuccess: isSuccessConfig} = usePrepareContractWrite({
        address: selectedCurrency.address,
        abi: erc20ABI,
        functionName: 'approve',
        args: [spender, amount * 10 ** selectedCurrency.precision],
        enabled: stepAllowanceReady,
    })

    const {
        data: allowance
    } = useContractRead(
        {
            address: selectedCurrency.address,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [session.user.address, spender],
            watch: true,
            // enabled: stepAllowanceReady
            // watch: stepAllowanceReady && !stepAllowance,
            // enabled: stepAllowanceReady
        }
    )


    const {
        data: transactionData,
        write,
        isError: isErrorWrite
    } = useContractWrite(config)


    const {isError: isErrorPending} = useWaitForTransaction({
        confirmations: 2,
        hash: transactionData?.hash,
    })


    const allowanceHuman = (allowance ? allowance.toNumber() : 0) / 10 ** selectedCurrency.precision
    const isEnoughAllowance = amount <= allowanceHuman
    const amountLocale = Number(amount).toLocaleString()
    const allowanceLocale = Number(allowanceHuman).toLocaleString()

    const setAllowance = (state) => {
        if (!isEnoughAllowance && state === Transaction.Failed) {
            write()
        }
    }

    useEffect(()=>{
        if(isSuccessConfig && !stepAllowance && stepAllowanceReady) {
            if(isEnoughAllowance) {
                setStepAllowance(true)
            } else {
                setAllowance(Transaction.Failed)
            }
        }
    }, [isSuccessConfig, allowance, stepAllowanceReady])

    console.log("TT :: READ - isSuccessConfig", isSuccessConfig)
    console.log("TT :: READ - allowance", allowance?.toNumber())
    console.log("TT :: READ - stepAllowanceReady", stepAllowanceReady)
    console.log("TT :: READ - stepAllowance / enabled", stepAllowance)
    console.log("TT :: READ - stepAllowance / watch", stepAllowanceReady && !stepAllowance)



    const statuses = (state) => {
        switch (state) {
            case Transaction.Waiting: {
                return <>Check allowance</>
            }
            case Transaction.Processing: {
                return <>Getting allowance for ${amountLocale}</>
            }
            case Transaction.Executed: {
                return <>Allowance for ${amountLocale} set successfully </>
            }
            case Transaction.Failed: {
                return <span className="underline">Failed to set allowance for ${amountLocale}</span>
            }
            default: {
                return <>Check allowance</>
            }
        }
    }

    const prepareRow = (state) => {
        return <div className={`flex flex-row items-center ${getStatusColor(state)}`} onClick={() => setAllowance(state)}>
            {getIcon(state)}
            <div>
                {statuses(state)}
                {state !== Transaction.Executed && <div className="text-xs -mt-1">current allowance: ${allowanceLocale}</div>}
            </div>
        </div>
    }


    if (stepAllowance) return prepareRow(Transaction.Executed)
    if (!stepAllowanceReady) return prepareRow(Transaction.Waiting)
    if (isErrorWrite || isErrorPending) return prepareRow(Transaction.Failed)
    else return prepareRow(Transaction.Processing)


}

