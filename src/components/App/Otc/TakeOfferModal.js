import { useEffect} from "react";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import {getSignature} from "@/fetchers/otc.fetcher";
import moment from "moment";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import {INTERACTION_TYPE} from "@/components/App/BlockchainSteps/config";
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";
import DynamicIcon from "@/components/Icon";
import {NETWORKS} from "@/lib/utils";
import GenericRightModal from "@/components/Modal/GenericRightModal";
import Lottie from "lottie-react";
import lottieSuccess from "@/assets/lottie/success.json";


export const blockchainPrerequisite = async (params) => {
    const {signature, otcId, dealId, offerId, isSeller, requiredNetwork, account } = params
        if(
            signature?.expiry && signature.expiry > moment.utc().unix() && !isSeller
        ) {
            return {
                ok: true,
                data: {signature}
            }
        } else if(isSeller){
            return {
                ok: true,
                data: {valid: true}
            }
        } else {
            const transaction = await getSignature(offerId, requiredNetwork, otcId, dealId, account)
            if (transaction.ok) {
                return {
                    ok: true,
                    data: {signature: transaction.data}
                }
            } else {
                //todo: error handling
                return {
                    ok: false,
                }
            }
        }
}

export default function TakeOfferModal({model, setter, props}) {
    const {vault, currentMarket, offerDetails, refetchVault, refetchOffers} = props
    const { getCurrencySymbolByAddress, account, currencies, network, activeOtcContract, otcFee} = useEnvironmentContext();

    const {updateBlockchainProps, insertConfiguration, blockchainCleanup ,blockchainProps, DEFAULT_STEP_STATE} = useBlockchainContext();
    const transactionSuccessful = blockchainProps.result.transaction?.confirmation_data

    const selectedCurrency =  offerDetails ? currencies.find(el=> el.chainId === offerDetails.chainId && el.address === offerDetails.currency) : {}
    const userAllocation = currentMarket && vault?.length>0 ? vault.find(el => el.id === currentMarket.offerId) : {}
    const ownedAllocation = userAllocation?.invested ? userAllocation.invested - userAllocation.locked : 0
    const haveEnoughAllocation = offerDetails.isSell ? true : ownedAllocation >= offerDetails.amount;
    const totalPayment = offerDetails.isSell ? offerDetails.price + otcFee : otcFee

    const customLocks = () => {
        if(!haveEnoughAllocation) return {lock: true, text: "Not enough allocation"}
        else return {lock: false}
    }


    useEffect(() => {
        if (!model || !selectedCurrency?.address || !blockchainProps.isClean || !(totalPayment>0) || !offerDetails?.chainId) return;

        const {lock, text} = customLocks()

        insertConfiguration({
            data: {
                account: account.address,
                requiredNetwork: offerDetails?.chainId,
                amount: totalPayment,
                allowance: totalPayment,
                contract: activeOtcContract,
                currency: selectedCurrency.symbol,
                offerDetails: offerDetails,
                buttonText: "Take Offer",
                buttonCustomLock: lock,
                buttonCustomText: text,
                prerequisiteTextProcessing: "Getting signature",
                prerequisiteTextError: "Couldn't sign transaction",
                transactionType:  INTERACTION_TYPE.OTC_TAKE,
                otcId: offerDetails.otcId,
                dealId: offerDetails.dealId,
                offerId: offerDetails.offerId,
                isSeller: offerDetails.isSell,
            },
            steps: {
                network:true,
                liquidity:true,
                allowance:true,
                transaction:true,
            },
        });
    }, [
        model,
        selectedCurrency?.address,
        offerDetails?.chainId,
        totalPayment,
        currentMarket?.id,
        activeOtcContract
    ]);


    useEffect(() => {
        if (!model || !selectedCurrency?.address || blockchainProps.isClean) return;
        const {lock, text} = customLocks()

        updateBlockchainProps(
            [
                {path: 'data.buttonCustomLock', value: lock},
                {path: 'data.buttonCustomText', value: text},
            ],"take offer custom buttom"
        )
    }, [
        haveEnoughAllocation
    ]);

    if(!currentMarket?.name || !offerDetails?.currency) return

    const chainDesired = network.chains.find(el => el.id === offerDetails?.chainId)
    const cancelOfferAmount_parsed = offerDetails?.amount?.toLocaleString()
    const cancelOfferPrice_parsed = offerDetails?.price?.toLocaleString()



    const closeModal = async () => {
        if(transactionSuccessful) {
            await refetchVault()
            await refetchOffers()
        }
        setter()
        setTimeout(() => {
            blockchainCleanup()
        }, 400);
    }




    const title = () => {
        return (
            <>
                {transactionSuccessful ?
                    <>OTC offer <span className="text-app-success">filled</span></>
                    :
                    <><span className="text-app-success">Take</span> OTC offer</>
                }
            </>
        )
    }

    const contentQuery = () => {
        return (
            <div className="flex flex-col flex-1">
                <div>Are you sure you want to take this offer?</div>
                <div className="grid gap-1 grid-cols-2 my-10 mb-0">
                    <div className="font-bold">MARKET</div><div className={"text-right text-app-success"}>{currentMarket.name}</div>
                    <div className="font-bold">TYPE</div><div className={`text-right ${offerDetails.isSell ? 'text-app-error' : 'text-app-success'} `}>{offerDetails.isSell ? "SELL" : "BUY"}</div>
                    <div className="font-bold">BLOCKCHAIN</div><div className={"text-right flex flex-row justify-end"}>  <DynamicIcon name={NETWORKS[chainDesired?.id]} style={ButtonIconSize.hero4}/>
                    <span className={"truncate"}>{chainDesired?.name}</span></div>
                    <div className="font-bold">AMOUNT</div><div className={"text-right"}>${cancelOfferAmount_parsed}</div>
                    <div className="font-bold">PRICE</div><div className={"text-right"}>${cancelOfferPrice_parsed}</div>
                    <div className="font-bold">OTC FEE</div><div className={"text-right"}>${otcFee}</div>
                    <hr/>
                    <hr/>
                    <div className="font-bold text-gold pt-2">TOTAL PAYMENT</div>
                    <div className={"flex justify-end text-gold pt-2"}>
                            <DynamicIcon name={getCurrencySymbolByAddress(offerDetails.currency)} style={"w-6"}/>
                            <span className={"ml-2"}>${totalPayment}</span>
                    </div>
                </div>
                <BlockchainSteps/>
            </div>
        )
    }

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div className={"flex flex-1 flex-col justify-center items-center"}>
                    <div className={"-mt-10"}>You have successfully filled OTC offer.</div>
                    <Lottie animationData={lottieSuccess} loop={true} autoplay={true}
                            style={{width: '320px', margin: '30px auto 0px'}}/>
                </div>
            </div>
        )
    }

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentQuery()
    }

    return (<GenericRightModal isOpen={model} closeModal={() => closeModal()} title={title()} content={content()} />)
}

