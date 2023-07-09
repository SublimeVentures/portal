import GenericModal from "@/components/Modal/GenericModal";
import {useEffect, useState} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconCart from "@/assets/svg/Cart.svg";
import {getOtcBuyFunction} from "@/components/App/Otc/OtcSteps";
import {Tooltiper, TooltipType} from "@/components/Tooltip";
import {Switch} from "@headlessui/react";
import IconUsdc from "@/assets/svg/Usdc.svg";
import IconUsdt from "@/assets/svg/Usdt.svg";
import LiquidityStep from "@/components/App/Transactions/LiquidityStep";
import AllowanceStep from "@/components/App/Transactions/AllowanceStep";
import TransactStep from "@/components/App/Transactions/TransactStep";


export default function BuyModal({model, setter, props}) {
    const {currentMarket, buyOffer, refetchVault, refetchOffers, source, otcFee, currencies} = props
        // const {data: session} = useSession()
    const session = {} //todo: sesja
    const {ACL, id} = session.user

    const buyOfferAmount_parsed = buyOffer?.amount?.toLocaleString()
    const buyOfferPrice_parsed = buyOffer?.price?.toLocaleString()
    const finalPrice = buyOffer?.price + Number(otcFee)
    const finalPrice_parsed = finalPrice.toLocaleString()

    const [currency, setCurrency] = useState(false)

    const currencies_ = Object.keys(currencies).map(key => {
        let entry = currencies[key]
        entry.address = key
        return entry
    });
    const selectedCurrency = currencies_.find(el => el.symbol === (currency ? "USDT" : "USDC"))

    const otcCancelFunction = getOtcBuyFunction(source, currentMarket.id, buyOffer.dealId, ACL, id, selectedCurrency?.address)

    const [stepLiquidity, setStepLiquidity] = useState(false)
    const [stepAllowance, setStepAllowance] = useState(false)
    const [stepTransact, setStepTransact] = useState(false)
    const [success, setSuccess] = useState(false)

    const [processing, setProcessing] = useState(false)
    const [errors, setError] = useState(false)

    const buttonDisabled = !stepLiquidity || processing

    // console.log("props", props, success)

    const closeModal = async () => {
        if(success) {
            await refetchVault()
            await refetchOffers()
        }
        setter()
        setProcessing(false)
    }

    const buyProceed = async ()  => {
        setProcessing(true)
        // write()
    }

    useEffect(()=> {
        // console.log("ERROR: jest")
        if(errors) {
            setProcessing(false)
        }
    },[errors])

    // useEffect(()=> {
    //     if(!!transactionData || isErrorWrite || isErrorConfirmation) setProcessing(false)
    // }, [transactionData, isErrorWrite, isErrorConfirmation])
    //
    // useEffect(()=> {
    //     // setProcessing(false)
    //
    // }, [stepLiquidity, stepAllowance, stepTransact])

    const stepProps = {
        selectedCurrency,
        session,
        amount: finalPrice
    }


    const stepLiquidityProps = {
        isReady: model,
        isFinished: stepLiquidity,
        setFinished: setStepLiquidity,
        ...stepProps
    }

    const allowancePrevStep = model && stepLiquidity
    const isAllowanceReady = processing && model && stepLiquidity
    const stepAllowanceProps = {
        prevStep: allowancePrevStep,
        isReady: isAllowanceReady,
        isFinished: stepAllowance,
        setFinished: setStepAllowance,
        spender: source,
        errorHandler: setError,
        ...stepProps
    }

    const isTransactionPrevStep = allowancePrevStep && stepAllowance
    const isTransactionReady = isAllowanceReady && stepAllowance
    // console.log("RECHANGE - isTransactionReady", isTransactionReady)

    const stepTransactProps = {
        prevStep: isTransactionPrevStep,
        isReady: isTransactionReady,
        isFinished: stepTransact,
        setFinished: setStepTransact,
        writeFunction: otcCancelFunction,
        errorHandler: setError,
        setSuccess,
        ...stepProps
    }



    const title = () => {
        return (
            <>
                {success ?
                    <>Purchase <span className="text-app-success">successful</span></>
                    :
                    <><span className="text-app-success">Buy</span> OTC offer</>
                }
            </>
        )
    }

    const contentQuery = () => {
        return (
            <div className="flex flex-col flex-1">
                <div>Are you sure you want to buy this offer?</div>
                <div className="grid gap-1 grid-cols-2 my-10 mx-5">
                    <div className="font-bold">MARKET</div><div className={"text-right text-app-success"}>{currentMarket.name}</div>
                    <div className="font-bold">TYPE</div><div className={"text-right"}>SELL</div>
                    <div className="font-bold">AMOUNT</div><div className={"text-right"}>${buyOfferAmount_parsed}</div>
                    <div className="font-bold">PRICE</div>
                    <div className={"text-right"}>${buyOfferPrice_parsed} + <Tooltiper wrapper={`$${otcFee}`} text={"Fixed fee for OTC trading"} type={TooltipType.Error}/>  = ${finalPrice_parsed}</div>

                    <div className="font-bold uppercase mt-5">currency</div>
                    <div className={"text-right  mt-1"}>
                        <Switch
                            checked={currency}
                            onChange={setCurrency}
                            className={`${currency ? 'bgUsdt' : 'bgUsdc'} ${processing ? 'disabled' : ''}
          relative inline-flex h-[28px] w-[60px] outline-0 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-0  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                <span
                    aria-hidden="true"
                    className={`${currency ? 'translate-x-8' : 'translate-x-0'}
            pointer-events-none inline-block h-[0px] w-[0px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                >
                    {!currency && <IconUsdc className="w-8 h-8 -mt-1 -ml-2"/>}
                    {currency && <IconUsdt className="w-8 h-8 -mt-1"/>}


                </span>
                        </Switch>
                    </div>

                </div>

                <div className="flex flex-col gap-2 pb-5 justify-content">
                    <LiquidityStep stepProps={{...props, ...stepLiquidityProps}} />
                    <AllowanceStep stepProps={{...props, ...stepAllowanceProps}} />
                    <TransactStep stepProps={{...props, ...stepTransactProps}}/>
                </div>

                <div className="mt-auto fullWidth">
                   <RoundButton  text={'purchase'} handler={buyProceed} isLoading={processing} isDisabled={buttonDisabled} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<IconCart className={ButtonIconSize.hero}/> } />
                </div>
            </div>
        )
    }

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div>You have successfully purchased OTC offer.</div>
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

