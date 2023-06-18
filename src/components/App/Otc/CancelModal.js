import GenericModal from "@/components/Modal/GenericModal";
import {useEffect, useState} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
// import {useSession} from "next-auth/react";
import IconTrash from "@/assets/svg/trash.svg";
import {useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import {getOtcCancelFunction} from "@/components/App/Otc/OtcSteps";


export default function CancelModal({model, setter, props}) {
    const {currentMarket, cancelOffer, refetchVault, refetchOffers, source} = props
    // const {data: session} = useSession()
    const session = {} //todo: sesja
    const {address, ACL, id} = session.user
    const [processing, setProcessing] = useState(false)
    const [success, setSuccess] = useState(false)

    const cancelOfferAmount_parsed = cancelOffer?.amount?.toLocaleString()
    const cancelOfferPrice_parsed = cancelOffer?.price?.toLocaleString()

    const otcCancelFunction = getOtcCancelFunction(source, currentMarket.id, cancelOffer.dealId, ACL, address, id)

    const {config, isSuccess: isSuccessPrepare, isLoading, isError: isErrorPrep, error:errorPrep} = usePrepareContractWrite({
        address: otcCancelFunction.address,
        abi: otcCancelFunction.abi,
        functionName: otcCancelFunction.method,
        args: otcCancelFunction.args,
        enabled: model
    })

    const {
        data: transactionData,
        write,
        isError: isErrorWrite,
        error: errorWrite,
        isLoading: isLoadingWrite
    } = useContractWrite(config)

    const {data: confirmationData, isError: isErrorConfirmation, isLoading: isLoadingConfirmation, } = useWaitForTransaction({
        confirmations: 1,
        hash: transactionData?.hash,
    })

    const buttonDisabled = !isSuccessPrepare || isLoading || processing

    const closeModal = async () => {
        if(success) {
            await refetchVault()
            await refetchOffers()
        }
        setter()
        setTimeout(() => {
            console.log("USTAWIAM :: success", false)
            setSuccess(false)
            setProcessing(false)
        }, 1000);
    }

    const cancelProceed = async ()  => {
        setProcessing(true)
        write()
    }


    useEffect(()=> {
        if(!!confirmationData || isErrorWrite || Object.keys(isErrorConfirmation).length > 0) {
            console.log("USTAWIAM :: success", true)
            setSuccess(true)
            setProcessing(false)
        }
    }, [confirmationData, isErrorWrite, isErrorConfirmation, isLoadingConfirmation])

    const title = () => {
        return (
            <>
                {success ?
                    <>OTC offer <span className="text-app-success">cancelled</span></>
                    :
                    <><span className="text-app-error">Cancel</span> OTC offer</>
                }
            </>
        )
    }

    const contentQuery = () => {
        return (
            <div className="flex flex-col flex-1">
                <div>Are you sure you want to cancel this offer?</div>
                <div className="grid gap-1 grid-cols-2 my-10 mx-5">
                    <div className="font-bold">MARKET</div><div className={"text-right text-app-success"}>{currentMarket.name}</div>
                    <div className="font-bold">TYPE</div><div className={"text-right"}>SELL</div>
                    <div className="font-bold">AMOUNT</div><div className={"text-right"}>${cancelOfferAmount_parsed}</div>
                    <div className="font-bold">PRICE</div><div className={"text-right"}>${cancelOfferPrice_parsed}</div>
                </div>

                <div className="mt-auto fullWidth">
                   <RoundButton text={'proceed'} handler={cancelProceed} isLoading={processing} isDisabled={buttonDisabled} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<IconTrash className={ButtonIconSize.hero2}/> } />
                </div>
                {(isErrorPrep) && <div className={"text-app-error mt-5  text-center"}>{errorPrep?.cause?.reason ? errorPrep?.cause?.reason : errorPrep.reason}</div>}
                {(isErrorWrite) && <div className={"text-app-error mt-5 text-center"}>{errorWrite?.cause?.reason ? errorWrite?.cause?.reason : "Unexpected wallet error"}</div>}

            </div>
        )
    }

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div>You have successfully cancelled OTC offer.</div>
                <lottie-player
                    autoplay
                    style={{width: '320px', margin: '30px auto 0px'}}
                    mode="normal"
                    src="/static/lottie/success.json"
                />
            </div>
        )
    }

    const content = () => {
       return success ? contentSuccess() : contentQuery()
    }

    return (<GenericModal isOpen={model} closeModal={() => closeModal()} title={title()} content={content()} />)
}

