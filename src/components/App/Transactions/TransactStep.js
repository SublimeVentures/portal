import {usePrepareContractWrite, useContractWrite, useWaitForTransaction, usePrepareSendTransaction} from 'wagmi'
import {useSession} from "next-auth/react";
import {getIcon, getInvestFunction, getStatusColor, Transaction} from "@/components/App/Transactions/TransactionSteps";
import {useEffect} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import RocketIcon from "@/assets/svg/Rocket.svg";

export default function TransactStep({stepProps}) {
    const {isReady, amount, setFinished, writeFunction, userAddress} = stepProps
    const amountLocal = Number(amount).toLocaleString()

    const {
        config: configPrep,
        isSuccess: successPrep,
        error:errorPrep,
        isError: isErrorPrep
    } = usePrepareContractWrite({
        address: writeFunction.address,
        abi: writeFunction.abi,
        functionName: writeFunction.method,
        args: writeFunction.args,
        overrides: {
            from: userAddress,
        },
        enabled: isReady
    })

    const {
        data: txId,
        write: sendTransaction,
        isError: isErrorWrite,
        error: errorWrite,
        isSuccess: isSuccessWrite,
        isLoading: isLoadingWrite
    } = useContractWrite(configPrep)


    const {
        data: transferConfirmed,
        isError: isErrorConfirmed,
        error: errorConfirmed,
        isSuccess:isSuccessConfirmed,
        isLoading: isLoadingConfirmed,
        isFetching: isFetchingConfirmed
    } = useWaitForTransaction({
        confirmations: 2,
        hash: txId?.hash,
    })


    console.log("======" )
    console.log("STATE :: isReady " , isReady)
    console.log("STATE :: successPrep " , successPrep)
    console.log("STATE :: isErrorPrep " , isErrorPrep)
    console.log("STATE :: txId " , txId)
    console.log("STATE :: isErrorWrite " , isErrorWrite)
    console.log("STATE :: errorWrite " , errorWrite)
    console.log("STATE :: isSuccessWrite " , isSuccessWrite)
    console.log("STATE :: isLoadingWrite " , isLoadingWrite)
    console.log("STATE :: transferConfirmed " , transferConfirmed)
    console.log("STATE :: isErrorConfirmed " , isErrorConfirmed)
    console.log("STATE :: errorConfirmed " , errorConfirmed)
    console.log("STATE :: isSuccessConfirmed " , isSuccessConfirmed)
    console.log("STATE :: isLoadingConfirmed " , isLoadingConfirmed)
    console.log("STATE :: isFetchingConfirmed " , isFetchingConfirmed)
    console.log("======" )


    const disabledButton = !isReady || isLoadingWrite || isLoadingConfirmed || isFetchingConfirmed
    const buttonText = disabledButton && isReady ? (successPrep ? "Processing..." : "Waiting..." ) : 'Transfer funds'

    const transfer = () => {
        if(isReady && successPrep) {
            sendTransaction()
        }
    }

    useEffect(()=>{
        if(!!transferConfirmed && isSuccessConfirmed) {
            setFinished(true)
        }
    }, [transferConfirmed, isSuccessConfirmed])

    return (
        <div className={'fullWidth mt-auto pt-7 pb-5'}>
            <RoundButton text={buttonText} isWide={true} size={'text-sm sm'} isDisabled={disabledButton} handler={transfer}
                         icon={<RocketIcon className={ButtonIconSize.hero}/>}/>
            {!!errorConfirmed || !!errorWrite && <div className={"text-app-error  mt-2 text-center"}>{errorConfirmed}<br/>{errorWrite.cause.reason.toUpperCase()}</div>}
        </div>
    )
}

