import {usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'
import {useSession} from "next-auth/react";
import {getIcon, getInvestFunction, getStatusColor, Transaction} from "@/components/App/Transactions/TransactionSteps";
import {useEffect} from "react";

export default function TransactStep({stepProps}) {
    const {isReady, setSuccess, amount, isFinished, setFinished, writeFunction, errorHandler} = stepProps

    // const {amount, selectedCurrency, isFromStake, hash, offer, stepInvestment, setStepInvestment, stepInvestmentReady, setTransactionData} = stepProps


    // const ACL = session.user.ACL
    // const ID = session.user.id
    const amountLocal = Number(amount).toLocaleString()

    // const investFunction = getInvestFunction(ACL, isFromStake, amount, offer, selectedCurrency, hash, ID)

    const {config, isSuccess: isSuccessConfig} = usePrepareContractWrite({
        address: writeFunction.address,
        abi: writeFunction.abi,
        functionName: writeFunction.method,
        args: writeFunction.args,
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
        }
    }

    useEffect(()=>{
        if(isSuccessConfig && !isFinished && isReady) {
            if(confirmationData) {
                setFinished(true)
                console.log("ustawiam transakcje",transactionData?.hash, transactionData )
                setSuccess(transactionData?.hash)
            } else {
                executeTransfer(Transaction.Failed)
            }
        }
    }, [isSuccessConfig, confirmationData, isSuccessConfig, isReady])


    useEffect(()=>{
        if(isErrorWrite || isErrorPending) {
            errorHandler(true)
        } else {
            errorHandler(false)
        }
    }, [isErrorWrite, isErrorPending])

    // console.log("TT :: INVEST - isSuccessConfig", isSuccessConfig)
    // console.log("TT :: INVEST - confirmationData", confirmationData)
    // console.log("TT :: INVEST - isReady / enabled", isReady)


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

    if (isFinished && confirmationData) return prepareRow(Transaction.Executed)
    if (!isReady) return prepareRow(Transaction.Waiting)
    if (isErrorWrite || isErrorPending) return prepareRow(Transaction.Failed)
    return prepareRow(Transaction.Processing)


}

