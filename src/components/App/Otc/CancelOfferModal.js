import GenericModal from "@/components/Modal/GenericModal";
import {useRef, useState} from "react";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import IconTrash from "@/assets/svg/trash.svg";
import {getOtcCancelFunction} from "@/components/App/Otc/OtcSteps";
import useGetChainEnvironment from "@/lib/hooks/useGetChainEnvironment";
import {useSwitchNetwork} from "wagmi";
import {getChainIcon} from "@/components/Navigation/StoreNetwork";
import BlockchainSteps from "@/components/App/BlockchainSteps";


export default function CancelOfferModal({model, setter, props}) {
    const {getCurrencyIcon, currentMarket, offerDetails, refetchVault, refetchOffers, account, currencies,diamonds} = props
    const {chains} = useSwitchNetwork()

    const cancelOfferAmount_parsed = offerDetails?.amount?.toLocaleString()
    const cancelOfferPrice_parsed = offerDetails?.price?.toLocaleString()

    const [blockchainData, setBlockchainData] = useState(false)
    const {diamond} = useGetChainEnvironment(currencies, diamonds)

    const {transactionData} = blockchainData
    const blockchainRef = useRef();

    if(!currentMarket?.name || !offerDetails?.currency) return

    const otcCancelFunction = getOtcCancelFunction(currentMarket.market, offerDetails.dealId, diamond)

    const closeModal = async () => {
        if(transactionData?.transferConfirmed) {
            await refetchVault()
            await refetchOffers()
        }
        setter()
        setTimeout(() => {
            setBlockchainData(false)
        }, 400);
    }



    const chainDesired = chains.find(el => el.id === offerDetails?.chainId)

    const blockchainProps = {
        processingData: {
            requiredNetwork: offerDetails?.chainId,
            forcePrecheck: false,
            userWallet: account.address,
            diamond: diamond,
            transactionData: otcCancelFunction
        },
        buttonData: {
            icon: <IconTrash className={ButtonIconSize.hero5}/>,
            text: "Cancel Offer",
        },
        checkNetwork: true,
        checkTransaction: true,
        showButton: true,
        saveData: true,
        saveDataFn: setBlockchainData,
    }

    const title = () => {
        return (
            <>
                {transactionData?.transferConfirmed ?
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
                    <div className="font-bold">TYPE</div><div className={`text-right ${offerDetails.isSell ? 'text-app-error' : 'text-app-success'} `}>{offerDetails.isSell ? "SELL" : "BUY"}</div>
                        <div className="font-bold">BLOCKCHAIN</div>
                        <div className="flex flex-row justify-end items-center overflow-hidden whitespace-nowrap">
                            {getChainIcon(chainDesired?.id, ButtonIconSize.hero4)}
                            <span className="text-right truncate">{chainDesired?.name}</span>
                        </div>

                    <div className="font-bold">AMOUNT</div><div className={"text-right"}>${cancelOfferAmount_parsed}</div>
                    <div className="font-bold">PRICE</div><div className={"text-right"}>${cancelOfferPrice_parsed}</div>
                    {!offerDetails.isSell && <><div className="font-bold text-gold">FUNDS RETURNED</div><div className={"flex justify-end text-gold"}>{getCurrencyIcon(offerDetails.currency, currencies)} <span className={"ml-2"}>${cancelOfferPrice_parsed}</span></div></>}

                </div>
                <BlockchainSteps ref={blockchainRef}  blockchainProps={blockchainProps}/>
            </div>
        )
    }

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div>You have successfully cancelled OTC offer.</div>
                {/*<lottie-player*/}
                {/*    autoplay*/}
                {/*    style={{width: '320px', margin: '30px auto 0px'}}*/}
                {/*    mode="normal"*/}
                {/*    src="/static/lottie/success.json"*/}
                {/*/>*/}
            </div>
        )
    }

    const content = () => {
       return transactionData?.transferConfirmed ? contentSuccess() : contentQuery()
    }

    return (<GenericModal isOpen={model} closeModal={() => closeModal()} title={title()} content={content()} />)
}

