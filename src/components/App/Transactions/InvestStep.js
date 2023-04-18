import {erc20ABI, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'
import {useSession} from "next-auth/react";
import {getIcon, getInvestFunction, getStatusColor, Transaction} from "@/components/App/Transactions/TransactionSteps";
import {useEffect} from "react";

export default function InvestStep({amount, currency, isReady, isFromStake, offer, hash, confirmSuccess}) {
    const {data: session} = useSession()
    const ACL = session.user.ACL
    const ID = session.user.id

    const investFunction = getInvestFunction(ACL, isFromStake, amount, offer, currency, hash, ID)
    console.log("invest function", investFunction)
    const {config, isSuccess: isSuccessConfig} = usePrepareContractWrite({
        address: investFunction.address,
        abi: investFunction.abi,
        functionName: investFunction.method,
        args: investFunction.args,
        enabled: isReady
    })

    const {
        data: transactionData,
        write,
        isError: isErrorWrite
    } = useContractWrite(config)


    const {data: confirmationData, isError: isErrorPending} = useWaitForTransaction({
        confirmations: 2,
        hash: transactionData?.hash,
    })

    const executeTransfer = (state) => {
        if (state === Transaction.Failed) {
            write()
        } else {
            confirmSuccess(transactionData?.hash)
            console.log("OFICJALNIE ZAKONCZYLEM INWESTYCJE", transactionData?.hash)
        }
    }

    const amountLocal = Number(amount).toLocaleString()

    const statuses = (state) => {
        switch (state) {
            case Transaction.Waiting: {
                return <>Execute transfer</>
            }
            case Transaction.Processing: {
                return <>Processing transfer of ${amountLocal}</>
            }
            case Transaction.Executed: {
                return <>Investment successful</>
            }
            case Transaction.Failed: {
                return <span className="underline">Failed to execute transfer</span>
            }
            default: {
                return <>Execute transfer</>
            }
        }
    }

    const prepareRow = (state) => {
        return <div className={`flex flex-row items-center ${getStatusColor(state)}`} onClick={() => executeTransfer(state)}>
            {getIcon(state)}
            <div>
                {statuses(state)}
            </div>
        </div>
    }

    useEffect(()=>{
        if(isReady && isSuccessConfig) {
            executeTransfer(Transaction.Failed)
        }
    }, [isReady, confirmationData, isSuccessConfig])


    if (!isReady) return prepareRow(Transaction.Waiting)
    if (confirmationData) return prepareRow(Transaction.Executed)
    if (isErrorWrite || isErrorPending) return prepareRow(Transaction.Failed)
    return prepareRow(Transaction.Processing)


}

