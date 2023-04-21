import {usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'
import {useSession} from "next-auth/react";
import {getIcon, getInvestFunction, getStatusColor, Transaction} from "@/components/App/Transactions/TransactionSteps";
import {useEffect} from "react";

export default function InvestStep({stepProps}) {
    const {amount, selectedCurrency, isFromStake, hash, offer, stepInvestment, setStepInvestment, stepInvestmentReady, setTransactionData} = stepProps


    const {data: session} = useSession()
    const ACL = session.user.ACL
    const ID = session.user.id
    const amountLocal = Number(amount).toLocaleString()

    const investFunction = getInvestFunction(ACL, isFromStake, amount, offer, selectedCurrency, hash, ID)
    console.log("invest function", investFunction)
    const {config, isSuccess: isSuccessConfig} = usePrepareContractWrite({
        address: investFunction.address,
        abi: investFunction.abi,
        functionName: investFunction.method,
        args: investFunction.args,
        enabled: stepInvestmentReady
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
        if(isSuccessConfig && !stepInvestment && stepInvestmentReady) {
            if(confirmationData) {
                setStepInvestment(true)
                setTransactionData(transactionData?.hash)
            } else {
                executeTransfer(Transaction.Failed)
            }
        }
    }, [isSuccessConfig, confirmationData, isSuccessConfig, stepInvestmentReady])

    console.log("TT :: INVEST - isSuccessConfig", isSuccessConfig)
    console.log("TT :: INVEST - confirmationData", confirmationData)
    console.log("TT :: INVEST - stepInvestmentReady / enabled", stepInvestmentReady)


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

    if (confirmationData) return prepareRow(Transaction.Executed)
    if (!stepInvestmentReady) return prepareRow(Transaction.Waiting)
    if (isErrorWrite || isErrorPending) return prepareRow(Transaction.Failed)
    return prepareRow(Transaction.Processing)


}

