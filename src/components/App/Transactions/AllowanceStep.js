import {erc20ABI, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'
import {useSession} from "next-auth/react";
import {getIcon, getStatusColor, Transaction} from "@/components/App/Transactions/TransactionSteps";
import {useEffect, useState} from "react";

export default function AllowanceStep({amount, spender, currency, isReady, confirmSuccess}) {
    const {data: session} = useSession()
    const [success, setSuccess] = useState(false)

    const {config, isSuccess: isSuccessConfig} = usePrepareContractWrite({
        address: currency.address,
        abi: erc20ABI,
        functionName: 'approve',
        args: [spender, amount * 10 ** currency.precision],
    })

    const {
        data: allowance
    } = useContractRead(
        {
            address: currency.address,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [session.user.address, spender],
            watch: true,
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


    const allowanceHuman = (allowance ? allowance.toNumber() : 0) / 10 ** currency.precision
    const isEnoughAllowance = amount <= allowanceHuman
    const amountLocale = Number(amount).toLocaleString()
    const allowanceLocale = Number(allowanceHuman).toLocaleString()

    const setAllowance = (state) => {
        if (!isEnoughAllowance && state === Transaction.Failed) {
            write()
        }
    }

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

    useEffect(()=>{
        if(isSuccessConfig && isReady) {
            if(!isEnoughAllowance) {
                setAllowance(Transaction.Failed)
            } else {
                if(!success) {
                    setSuccess(true)
                    confirmSuccess()
                }

            }
        }
    }, [isSuccessConfig, allowance, isReady])


    if (!isReady) return prepareRow(Transaction.Waiting)
    if (isEnoughAllowance) return prepareRow(Transaction.Executed)
    if (isErrorWrite || isErrorPending) return prepareRow(Transaction.Failed)
    else return prepareRow(Transaction.Processing)


}

