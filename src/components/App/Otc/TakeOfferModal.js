import GenericModal from "@/components/Modal/GenericModal";
import { useEffect} from "react";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import useGetChainEnvironment from "@/lib/hooks/useGetChainEnvironment";
import {useSwitchNetwork} from "wagmi";
import {getChainIcon} from "@/components/Navigation/StoreNetwork";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import {getSignature} from "@/fetchers/otc.fetcher";
import moment from "moment";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import {INTERACTION_TYPE} from "@/components/App/BlockchainSteps/config";
import RocketIcon from "@/assets/svg/Rocket.svg";


export const blockchainPrerequisite = async (params) => {
    const {signature, offerDetails, currentMarket} = params
        if(
            signature?.expiry && signature.expiry > moment.utc().unix() && !offerDetails.isSell
        ) {
            return {
                ok: true,
                data: {signature}
            }
        } else if(offerDetails.isSell){
            return {
                ok: true,
                data: {valid: true}
            }
        } else {
            const transaction = await getSignature(currentMarket.id, offerDetails.chainId, currentMarket.market, offerDetails.dealId)
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
    const {getCurrencyIcon,vault, otcFee, currentMarket, offerDetails, refetchVault, refetchOffers, account, currencies,diamonds} = props
    const {chains} = useSwitchNetwork()
    const {updateBlockchainProps, insertConfiguration, blockchainCleanup ,blockchainProps} = useBlockchainContext();
    const transactionSuccessful = blockchainProps.result.transaction?.confirmation_data

    const {diamond, currencyListAll} = useGetChainEnvironment(currencies, diamonds)
    const selectedCurrency =  offerDetails && currencyListAll ? currencyListAll[offerDetails.chainId][offerDetails.currency] : {}
    const userAllocation = currentMarket && vault ? vault.find(el => el.offerId === currentMarket.id) : {}
    const ownedAllocation = userAllocation ? userAllocation.invested - userAllocation.locked : 0
    const haveEnoughAllocation = offerDetails.isSell ? true : ownedAllocation >= offerDetails.amount;
    const totalPayment = offerDetails.isSell ? offerDetails.price + otcFee : otcFee

    const customLocks = () => {
        if(!haveEnoughAllocation) return {lock: true, text: "Not enough allocation"}
        else return {lock: false}
    }

    // const buttonFn = async () => {
    //
    //     if(
    //         signature?.expiry && signature.expiry > moment.utc().unix() && !offerDetails.isSell
    //     ) {
    //         return [{ param: 'signature', value: signature }]
    //     } else if(offerDetails.isSell){
    //         return {
    //             ok: true,
    //             update: [{ param: 'listen', value: false }]
    //         }
    //     } else {
    //         const transaction = await getSignature(currentMarket.id, offerDetails.chainId, currentMarket.market, offerDetails.dealId)
    //         if (transaction.ok) {
    //             setSignature(transaction.data)
    //             return [
    //                 { param: 'signature', value: transaction.data },
    //                 { param: 'listen', value: true },
    //             ]
    //         } else {
    //             //todo: error handling
    //             return {
    //                 ok: false,
    //             }
    //         }
    //     }
    // }

    useEffect(() => {
        if (!model || !selectedCurrency?.address || !blockchainProps.isClean || !(totalPayment>0) || !offerDetails?.chainId) return;

        const {lock, text} = customLocks()

        insertConfiguration({
            data: {
                requiredNetwork: offerDetails?.chainId,
                amount: totalPayment,
                amountAllowance: totalPayment,
                userWallet: account.address,
                currency: selectedCurrency,
                diamond: diamond,
                button: {
                    icon: <RocketIcon className="w-10 mr-2"/>,
                    text: "Take Offer",
                    customLockState: lock,
                    customLockText: text,
                },
                prerequisite: {
                    offerDetails,
                    currentMarket,
                    textProcessing: "Getting signature",
                    textError: "Couldn't sign transaction"
                },
                transaction: {
                    type: INTERACTION_TYPE.OTC_TAKE,
                    params: {
                        // signature <-- from prerequisite
                        otcId: currentMarket.market,
                        dealId: offerDetails.dealId,
                        diamond,
                    },
                },
            },
            steps: {
                prerequisite: true,
                network:true,
                liquidity:true,
                allowance:true,
                transaction:true,
                button:true,
            },
        });
    }, [
        model,
        selectedCurrency?.address,
        offerDetails?.chainId,
        totalPayment,
        currentMarket?.id
    ]);

    useEffect(() => {
        if (!selectedCurrency?.address || blockchainProps.isClean) return;
        const {lock, text} = customLocks()

        updateBlockchainProps(
            [
                {path: 'data.button.customLockState', value: lock},
                {path: 'data.button.customLockText', value: text},
            ],"take offer custom buttom"
        )
    }, [
        haveEnoughAllocation
    ]);



    if(!currentMarket?.name || !offerDetails?.currency || !diamond) return

    const chainDesired = chains.find(el => el.id === offerDetails?.chainId)
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
                <div className="grid gap-1 grid-cols-2 my-10 mx-5 mb-0">
                    <div className="font-bold">MARKET</div><div className={"text-right text-app-success"}>{currentMarket.name}</div>
                    <div className="font-bold">TYPE</div><div className={`text-right ${offerDetails.isSell ? 'text-app-error' : 'text-app-success'} `}>{offerDetails.isSell ? "SELL" : "BUY"}</div>
                    <div className="font-bold">BLOCKCHAIN</div><div className={"text-right flex flex-row justify-end"}>{getChainIcon(chainDesired?.id, ButtonIconSize.hero4)} <span className={"truncate"}>{chainDesired?.name}</span></div>
                    <div className="font-bold">AMOUNT</div><div className={"text-right"}>${cancelOfferAmount_parsed}</div>
                    <div className="font-bold">PRICE</div><div className={"text-right"}>${cancelOfferPrice_parsed}</div>
                    <div className="font-bold">OTC FEE</div><div className={"text-right"}>${otcFee}</div>
                    <hr/>
                    <hr/>
                    <div className="font-bold text-gold">TOTAL PAYMENT</div><div className={"flex justify-end text-gold"}>{getCurrencyIcon(offerDetails.currency, currencies)} <span className={"ml-2"}>${totalPayment}</span></div>
                </div>
                <BlockchainSteps/>
            </div>
        )
    }

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div>You have successfully filled OTC offer.</div>
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
        return transactionSuccessful ? contentSuccess() : contentQuery()
    }

    return (<GenericModal isOpen={model} closeModal={() => closeModal()} title={title()} content={content()} />)
}

