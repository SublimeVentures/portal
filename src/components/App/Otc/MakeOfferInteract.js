import {useEffect, useState} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import RocketIcon from "@/assets/svg/Rocket.svg";
import {
    erc20ABI, useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction
} from "wagmi";
import {getOtcTradeFunction} from "@/components/App/Otc/OtcSteps";
import {removeTransaction, saveTransaction} from "@/fetchers/otc.fetcher";


const parseError = (code) => {
    switch (code) {
        case "NOT_ENOUGH_ALLOCATION": {
            return "You don't have enough available allocation."
        }
    }
}

export default function MakeOfferInteract({props}) {
    const {session, amount, price, allocationMax,processing, setProcessing, diamond,chain,refetchVault, currentMarket, selectedCurrency, isBuyer, statusCheck, setIsSuccess} = props
    const {address} = session.user

    const [hash, setHash] = useState("")

    const [error, setError] = useState(null)

    const otcSellFunction = getOtcTradeFunction(isBuyer, diamond, currentMarket.id, amount, price, selectedCurrency, hash)


    const checkAllowanceEnabled = isBuyer && !hash && processing
    // console.log("=============== BEGINNING ")
    const {
        isLoading: isLoadingAllowance,
        isFetching: isFetchingAllowance,
        isSuccess: isSuccessAllowance,
        isFetched: isFetchedAllowance,
        data: allowance
    } = useContractRead(
        {
            address: selectedCurrency.address,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [session.user.address, diamond],
            watch: checkAllowanceEnabled,
            enabled: checkAllowanceEnabled,
        }
    )

    // console.log("MOI --- allowance - isLoading?",checkAllowanceEnabled, allowance.toNumber())


    const allowanceHuman = (allowance ? allowance.toNumber() : 0) / 10 ** selectedCurrency.precision
    const isEnoughAllowance = amount <= allowanceHuman
    console.log("MOI --- allowance - is enough?",isEnoughAllowance, allowance.toNumber(), amount)
    const {config: configApprove, isSuccess: isSuccessConfigApprove} = usePrepareContractWrite({
        address: selectedCurrency.address,
        abi: erc20ABI,
        functionName: 'approve',
        args: [diamond, amount * 10 ** selectedCurrency.precision],
        enabled: !isEnoughAllowance && checkAllowanceEnabled && amount>0,
    })
    console.log("MOI --- approve - prepare write ",!isEnoughAllowance && checkAllowanceEnabled && amount>0, isSuccessConfigApprove)



    const {
        data: transactionDataAllowance,
        write: writeAllowance,
        isError: isErrorWriteAllowance,
        isSuccess: isSuccessWriteAllowance,
        isLoading: isLoadingWriteAllowance,
    } = useContractWrite(configApprove)

    const {isError: isErrorPendingAllowance,
        data: confirmationDataAllowance,
        isSuccess: isSuccessPendingAllowance,
        isLoading: isLoadingPending,
        isFetching: isFetchingPendingAllowance} = useWaitForTransaction({
        confirmations: 2,
        hash: transactionDataAllowance?.hash,
    })


    //----------------

    const {config, isSuccess: isSuccessPrepare, isLoading, isError: isErrorPrep, error:errorPrep} = usePrepareContractWrite({
        address: otcSellFunction.address,
        abi: otcSellFunction.abi,
        functionName: otcSellFunction.method,
        args: otcSellFunction.args,
        overrides: {
            from: address,
        },
        enabled: !statusCheck && hash
    })

    const {
        data: transactionData,
        write,
        isError: isErrorWrite,
        error: errorWrite,
        isLoading: isLoadingWrite
    } = useContractWrite(config)

    const {data: confirmationData, isError: isErrorConfirmation, isSuccess: isSuccessConfirmation } = useWaitForTransaction({
        confirmations: 1,
        hash: transactionData?.hash,
    })

    const buttonDisabled = statusCheck || allocationMax <= 0
    const buttonLoading = processing || (isSuccessPrepare && ( hash && !isSuccessPrepare || isLoading || isLoadingWrite)) //todo: waiting for confirmations



    const generateHash = async ()=> {
        const result = await saveTransaction(currentMarket.id, chain.id, isBuyer, amount, price)
        if(result.ok) {
            setHash(result.hash)
        } else {
            setError(parseError(result.code))
            await refetchVault()
            setProcessing(false)
        }
    }

    const makeOffer = async ()  => {
        setError(null);
        setProcessing(true)
        console.log("MOI --- MAKE OFFER - is Buyer OR Seller make offer",isBuyer && isSuccessPendingAllowance && !hash, !isBuyer && !hash)
        if(isBuyer && isSuccessPendingAllowance &&  isEnoughAllowance && !hash || !isBuyer && !hash) {
            await generateHash()
        }
    }

    const expireTransaction = async () => {
        if(isErrorWrite || isErrorConfirmation) {
            console.log("MOI --- Expire transaction")

            if(hash.length>0) {
                await removeTransaction(currentMarket.id, hash)
                setProcessing(false)
                setHash("")
            }
        }
    }

    const processIncreasedAllowance =  async() => {
        // console.log("MOI --- processIncreasedAllowance - processing")
        // console.log("MOI --- isSuccessPendingAllowance", isSuccessPendingAllowance)
        // console.log("MOI --- isEnoughAllowance", isEnoughAllowance)

        if(isSuccessPendingAllowance) {
            if(isEnoughAllowance) {
                await generateHash()
            } else {
                writeAllowance()
            }
        }
    }

    useEffect(()=> {
        console.log("MOI --- approve EFF - config ready : write ",isSuccessConfigApprove, isSuccessConfigApprove && !isEnoughAllowance && processing && isBuyer)
        console.log("MOI --- approve - prepare write -isSuccessConfigApprove",isSuccessConfigApprove)


        // if(isSuccessConfigApprove && !isEnoughAllowance && processing && isBuyer) {
        //     writeAllowance()
        // }
    }, [isSuccessConfigApprove])

    // useEffect(()=> {
    //     console.log("MOI --- isSuccessPendingAllowance",isSuccessPendingAllowance)
    //
    //     processIncreasedAllowance()
    // }, [isSuccessPendingAllowance])



    useEffect(()=> {
        if(isSuccessPrepare) {
            write()
        }
    }, [isSuccessPrepare])

    useEffect(()=> {
        if(isSuccessConfirmation) {
            setIsSuccess(true)
        }
    }, [isSuccessConfirmation])

    useEffect(()=> {
        expireTransaction()
    }, [isErrorWrite, isErrorConfirmation])


    return (
        <>
            <div className={`fullWidth pb-5 mt-auto pt-10`}>
                <RoundButton text={'Make offer'} isWide={true} size={'text-sm sm'} isDisabled={buttonDisabled}
                             isLoading={buttonLoading} handler={makeOffer}
                             icon={<RocketIcon className={ButtonIconSize.hero}/>}/>
            </div>

            <div className={"flex flex-1 text-app-error capitalize justify-center pb-2 "}>
                {(isErrorPrep) && <>{errorPrep?.cause?.reason ? errorPrep?.cause?.reason : errorPrep.reason}</>}
                {(isErrorWrite) && <>{errorWrite?.cause?.reason ? errorWrite?.cause?.reason : "Unexpected wallet error"}</>}
                {(error) && <>{error}</>}
            </div>
        </>
    )
}

