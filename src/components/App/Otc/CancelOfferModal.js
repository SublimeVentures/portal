import {useEffect} from "react";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import {INTERACTION_TYPE} from "@/components/App/BlockchainSteps/config";
import DynamicIcon from "@/components/Icon";
import {NETWORKS} from "@/lib/utils";
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";
import GenericRightModal from "@/components/Modal/GenericRightModal";
import Lottie from "lottie-react";
import lottieSuccess from "@/assets/lottie/success.json";


export default function CancelOfferModal({model, setter, props}) {
    const {
        currentMarket,
        offerDetails,
        refetchVault,
        refetchOffers,
    } = props
    const {
        insertConfiguration,
        blockchainCleanup,
        blockchainProps,
    } = useBlockchainContext();
    const {getCurrencySymbolByAddress, network, account, activeOtcContract} = useEnvironmentContext();

    const transactionSuccessful = blockchainProps.result.transaction?.confirmation_data

    const cancelOfferAmount_parsed = offerDetails?.amount?.toLocaleString()
    const cancelOfferPrice_parsed = offerDetails?.price?.toLocaleString()



    useEffect(() => {
        if (!model  || !offerDetails?.dealId || !offerDetails?.otcId) return;

        insertConfiguration({
            data: {
                account: account.address,
                requiredNetwork: offerDetails?.chainId,
                buttonText: "Cancel Offer",
                transactionType: INTERACTION_TYPE.OTC_CANCEL,
                dealId: offerDetails.dealId,
                otcId: currentMarket.otc,
                contract: activeOtcContract,
            },
            steps: {
                network: true,
                transaction: true,
            }
        });
    }, [
        model,
    ]);

    if (!currentMarket?.name || !offerDetails?.currency) return


    const closeModal = async () => {
        if (transactionSuccessful) {
            await refetchVault()
            await refetchOffers()
        }
        setter()
        setTimeout(() => {
            blockchainCleanup()
        }, 400);
    }


    const chainDesired = network.chains.find(el => el.id === offerDetails?.chainId)

    const title = () => {
        return (
            <>
                {transactionSuccessful ?
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
                <div className="grid gap-1 grid-cols-2 my-10">
                    <div className="font-bold">MARKET</div>
                    <div className={"text-right text-app-success"}>{currentMarket.name}</div>
                    <div className="font-bold">TYPE</div>
                    <div
                        className={`text-right ${offerDetails.isSell ? 'text-app-error' : 'text-app-success'} `}>{offerDetails.isSell ? "SELL" : "BUY"}</div>
                    <div className="font-bold">BLOCKCHAIN</div>
                    <div className="flex flex-row justify-end items-center overflow-hidden whitespace-nowrap">
                        <DynamicIcon name={NETWORKS[chainDesired?.id]} style={ButtonIconSize.hero4}/>
                        <span className="text-right truncate">{chainDesired?.name}</span>
                    </div>

                    <div className="font-bold">AMOUNT</div>
                    <div className={"text-right"}>${cancelOfferAmount_parsed}</div>
                    <div className="font-bold">PRICE</div>
                    <div className={"text-right"}>${cancelOfferPrice_parsed}</div>
                    {!offerDetails.isSell && <>
                        <div className="font-bold text-gold">FUNDS RETURNED</div>
                        <div
                            className={"flex justify-end text-gold"}>
                            <DynamicIcon name={getCurrencySymbolByAddress(offerDetails.currency)} style={ButtonIconSize.hero4}/>
                            <span className={"ml-2"}>${cancelOfferPrice_parsed}</span></div>
                    </>}

                </div>
                <BlockchainSteps/>
            </div>
        )
    }

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div className={"flex flex-1 flex-col justify-center items-center"}>
                    <div className={"-mt-10"}>You have successfully cancelled OTC offer.</div>
                    <Lottie animationData={lottieSuccess} loop={true} autoplay={true}
                            style={{width: '320px', margin: '30px auto 0px'}}/>
                </div>


            </div>
        )
    }

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentQuery()
    }

    return (<GenericRightModal isOpen={model} closeModal={() => closeModal()} title={title()} content={content()}/>)
}

