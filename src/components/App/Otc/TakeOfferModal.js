import GenericModal from "@/components/Modal/GenericModal";
import {useRef, useState, useEffect} from "react";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import IconTrash from "@/assets/svg/trash.svg";
import {getOtcTakeFunction} from "@/components/App/Otc/OtcSteps";
import useGetChainEnvironment from "@/lib/hooks/useGetChainEnvironment";
import {useSwitchNetwork} from "wagmi";
import {getChainIcon} from "@/components/Navigation/StoreNetwork";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import {getSignature} from "@/fetchers/otc.fetcher";
import moment from "moment";


export default function TakeOfferModal({model, setter, props}) {
    const {getCurrencyIcon,vault, otcFee, currentMarket, offerDetails, refetchVault, refetchOffers, account, currencies,diamonds} = props
    const {chains} = useSwitchNetwork()

    const [signature, setSignature] = useState(null)

    const [blockchainData, setBlockchainData] = useState(false)
    const {diamond, currencyListAll} = useGetChainEnvironment(currencies, diamonds)

    const {transactionData} = blockchainData
    const blockchainRef = useRef();

    useEffect(() => {
        // console.log("AllowanceStep - enough", isEnoughAllowance ,isReady)
        if(!signature?.expiry) return;
        blockchainRef.current.runProcess();

    }, [signature?.expiry])

    if(!currentMarket?.name || !offerDetails?.currency || !diamond) return
    const userAllocation = vault.find(el => el.offerId === currentMarket.id)
    const ownedAllocation = userAllocation ? userAllocation.invested - userAllocation.locked : 0
    const selectedCurrency =  currencyListAll[offerDetails.chainId][offerDetails.currency]
    const chainDesired = chains.find(el => el.id === offerDetails?.chainId)
    const cancelOfferAmount_parsed = offerDetails?.amount?.toLocaleString()
    const cancelOfferPrice_parsed = offerDetails?.price?.toLocaleString()

    const haveEnoughAllocation = offerDetails.isSell ? true : ownedAllocation >= offerDetails.amount;

    const totalPayment = offerDetails.isSell ? offerDetails.price + otcFee : otcFee
    const otcTakeFunction = getOtcTakeFunction(currentMarket.market, offerDetails.dealId, signature?.nonce, signature?.expiry, signature?.hash, diamond)
    const closeModal = async () => {
        if(transactionData?.transferConfirmed) {
            await refetchVault()
            await refetchOffers()
        }
        setter()
        setTimeout(() => {
            setBlockchainData(false)
            setSignature(null)
        }, 400);
    }

    const buttonFn = async () => {
        if(
            signature?.expiry && signature.expiry > moment.utc().unix() && !offerDetails.isSell ||
            offerDetails.isSell
        ) {
            blockchainRef.current.runProcess();
        } else {
                const transaction = await getSignature(currentMarket.id, offerDetails.chainId, currentMarket.market, offerDetails.dealId)
                if (transaction.ok) {
                    setSignature(transaction.data)
                } else {
                    //todo: error handling
                }
            }
    }

    const blockchainProps = {
        processingData: {
            requiredNetwork: offerDetails?.chainId,
            forcePrecheck: false,
            amount: totalPayment,
            amountAllowance: totalPayment,
            userWallet: account.address,
            currency: selectedCurrency,
            diamond: diamond,
            transactionData: otcTakeFunction
        },
        buttonData: {
            buttonFn,
            icon: <IconTrash className={ButtonIconSize.hero5}/>,
            text: "Take Offer",
            customLock: true,
            customLockParams: [
                {check: !haveEnoughAllocation, error: "Not enough allocation"},
            ],
        },
        checkNetwork: true,
        checkLiquidity: true,
        checkAllowance: true,
        checkTransaction: true,
        showButton: true,
        saveData: true,
        saveDataFn: setBlockchainData,
    }

    const title = () => {
        return (
            <>
                {transactionData?.transferConfirmed ?
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
                    <div className="font-bold">BLOCKCHAIN</div><div className={"text-right flex flex-row justify-end"}>{getChainIcon(chainDesired?.id, ButtonIconSize.hero4)} {chainDesired?.name}</div>
                    <div className="font-bold">AMOUNT</div><div className={"text-right"}>${cancelOfferAmount_parsed}</div>
                    <div className="font-bold">PRICE</div><div className={"text-right"}>${cancelOfferPrice_parsed}</div>
                    <div className="font-bold">OTC FEE</div><div className={"text-right"}>${otcFee}</div>
                    <hr/>
                    <hr/>
                    <div className="font-bold text-gold">TOTAL PAYMENT</div><div className={"flex justify-end text-gold"}>{getCurrencyIcon(offerDetails.currency, currencies)} <span className={"ml-2"}>${totalPayment}</span></div>
                </div>
                <BlockchainSteps ref={blockchainRef}  blockchainProps={blockchainProps}/>
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
        return transactionData?.transferConfirmed ? contentSuccess() : contentQuery()
    }

    return (<GenericModal isOpen={model} closeModal={() => closeModal()} title={title()} content={content()} />)
}

