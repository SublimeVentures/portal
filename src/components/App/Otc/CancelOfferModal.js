import GenericModal from "@/components/Modal/GenericModal";
import { useEffect} from "react";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import IconTrash from "@/assets/svg/trash.svg";
import useGetChainEnvironment from "@/lib/hooks/useGetChainEnvironment";
import {useSwitchNetwork} from "wagmi";
import {getChainIcon} from "@/components/Navigation/StoreNetwork";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import {INTERACTION_TYPE} from "@/components/App/BlockchainSteps/config";


export default function CancelOfferModal({model, setter, props}) {
    const {getCurrencyIcon, currentMarket, offerDetails, refetchVault, refetchOffers, account, currencies,diamonds} = props
    const {chains} = useSwitchNetwork()
    const { insertConfiguration, blockchainCleanup, updateBlockchainProps, blockchainProps, DEFAULT_STEP_STATE } = useBlockchainContext();
    const transactionSuccessful = blockchainProps.result.transaction?.confirmation_data

    const cancelOfferAmount_parsed = offerDetails?.amount?.toLocaleString()
    const cancelOfferPrice_parsed = offerDetails?.price?.toLocaleString()

    const {diamond} = useGetChainEnvironment(currencies, diamonds)


    useEffect(() => {

        if(!model || !diamond || !offerDetails?.dealId || !offerDetails?.otcId) return;

        insertConfiguration({
            data: {
                requiredNetwork: offerDetails?.chainId,
                forcePrecheck: false,
                userWallet: account.address,
                diamond: diamond,
                button: {
                    icon: <IconTrash className="w-10 mr-2"/>,
                    text: "Cancel Offer",
                },
                transaction: {
                    type: INTERACTION_TYPE.OTC_CANCEL,
                    params: {
                        diamond,
                        dealId: offerDetails.dealId,
                        otcId: currentMarket.market,
                    },
                },
            },
            steps: {
                prerequisite:true,
                network:true,
                transaction:true,
                button:true,
            }
        });
    }, [
        model,
    ]);

    useEffect(() => {
        if (!model || blockchainProps.isClean) return;
        updateBlockchainProps(
            [
                {path: 'data.diamond', value: diamond},
                {path: 'data.transaction.ready', value: false},
                {path: 'data.transaction.method', value: {}},
                {path: 'data.transaction.params.diamond', value: diamond},

                {path: 'state.prerequisite', value: { ...DEFAULT_STEP_STATE }},
                {path: 'state.network', value: { ...DEFAULT_STEP_STATE }},
                {path: 'state.liquidity', value: { ...DEFAULT_STEP_STATE }},
                {path: 'state.allowance', value: { ...DEFAULT_STEP_STATE }},
                {path: 'state.transaction', value: { ...DEFAULT_STEP_STATE }},
            ],"make offer val change"
        )
    }, [
        diamond
    ]);

    if(!currentMarket?.name || !offerDetails?.currency) return


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


    const chainDesired = chains.find(el => el.id === offerDetails?.chainId)

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
                <BlockchainSteps/>
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
       return transactionSuccessful ? contentSuccess() : contentQuery()
    }

    return (<GenericModal isOpen={model} closeModal={() => closeModal()} title={title()} content={content()} />)
}

