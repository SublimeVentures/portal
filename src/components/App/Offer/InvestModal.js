import GenericModal from "@/components/Modal/GenericModal";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import moment from "moment";
import {useState } from "react";

import LiquidityStep from "@/components/App/BlockchainSteps/LiquidityStep";
import TransactionStep, {TransactionState} from "@/components/App/BlockchainSteps/TransactionStep";


import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import PAGE, {ExternalLinks} from "@/routes";
import Link from "next/link";

import {ACLs}  from "@/lib/authHelpers";
import Linker from "@/components/link";
import {getButtonStep, getInvestFunction} from "@/components/App/BlockchainSteps/config";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {isBased, sleeper} from "@/lib/utils";
import RocketIcon from "@/assets/svg/Rocket.svg";
import Lottie from "lottie-react";
import lottieSuccess from "@/assets/lottie/success.json";

export const StakeSteps = {
    Select: 0,
    Use: 1,
    Skip: 2
}

export default function InvestModal({model, setter, investModalProps}) {
    if(!model) return;

    const [stake, setStake] = useState(StakeSteps.Select)
    const [isTransactionLoading, setIsTransactionLoading] = useState(TransactionState.Init)
    const [liquidity, setLiquidity] = useState(false)
    const [transaction, setTransaction] = useState(false)
    const [trigger, setTrigger] = useState(false)
    const [accept, setAccept] = useState(false)

    const {account, expires, investmentAmount, offer, selectedCurrency, hash, afterInvestmentCleanup, bookingExpire} = investModalProps

    const amountLocale = Number(investmentAmount).toLocaleString()
    const {ACL, id} = account

    const usingStakedFunds = stake === StakeSteps.Use
    const stepLiquidityReady = (ACL === ACLs.Whale && stake === StakeSteps.Skip) || ACL !== ACLs.Whale
    const stepLiquidityFinished = liquidity || usingStakedFunds
    const investFunction = getInvestFunction(ACL, usingStakedFunds, investmentAmount, offer, selectedCurrency, hash, id)
    const buttonText = getButtonStep(isTransactionLoading, "Transfer funds")

    const closeModal = () => {
        setter()
        if(transaction) {
            afterInvestmentCleanup()
        }
        setTimeout(() => {
            setStake(StakeSteps.Select)
            setLiquidity(false)
            setTransaction(false)
        }, 1000);
    }

    const run = async () => {
        setAccept(false);
        setTrigger(false)
        await sleeper(500)
        setAccept(true);
        setTrigger(true)
    }

    // const stepProps = {
    //     ...{amount: investmentAmount},
    //     offer,
    //     selectedCurrency,
    //     hash,
    //     account
    // }
    //
    // // const stepStakeProps = {
    // //     stepStake,
    // //     setStepStake,
    // // }
    //
    // const stepLiquidityProps = {
    //     isReady: stepLiquidityReady,
    //     isFinished: stepLiquidityFinished,
    //     setFinished: setStepLiquidity,
    //     ...stepProps
    // }
    //
    //
    // const stepTransactProps = {
    //     isReady: stepLiquidityFinished,
    //     isFinished: stepInvestment,
    //     setFinished: setStepInvestment,
    //     writeFunction: investFunction,
    //     errorHandler: setError,
    //     userAddress: address,
    //     ...stepProps
    // }

    const liquidityProps = {
        currencyAddress: selectedCurrency.address,
        currencyPrecision: selectedCurrency.precision,
        currencySymbol: selectedCurrency.symbol,
        isReady: stepLiquidityReady,
        account: account.address,
        amount: investmentAmount,
        isFinished: liquidity,
        setFinished: setLiquidity,
    }

    const transferReady = liquidity && accept
    const transactionProps = {
        transactionData: investFunction,
        account: account.address,
        isReady: transferReady,
        isFinished: transaction,
        setFinished: setTransaction,
        setIsTransactionLoading,
        trigger: trigger,
    }

    const title = () => {
        return (
            <>
                {transaction ?
                    <>Investment <span className="text-app-success">successful</span></>
                    :
                    <>Booking <span className="text-app-success">success</span></>
                }
            </>
        )
    }

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div>Congratulations! You have successfully invested <span className="text-app-success font-bold">${amountLocale}</span> in <span className="font-bold text-app-success">{offer.name}</span>.</div>
                <Lottie animationData={lottieSuccess} loop={true} autoplay={true} style={{width: '320px', margin: '30px auto 0px'}}/>;

                <div className="flex flex-1 justify-center items-center py-10 fullWidth">
                    <Link href={PAGE.App} className={` w-full fullWidth ${isBased ? "" : "flex flex-1 justify-center"}`}>
                        <UniButton type={ButtonTypes.BASE} text={'Check Vault'} state={"danger"} isLoading={false} isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'} />
                    </Link>
                </div>
                <div className="mt-auto">What's next? <Linker url={ExternalLinks.AFTER_INVESTMENT} /></div>
            </div>
        )
    }
    const contentSteps = () => {
        return (
            <div className={`flex flex-1 flex-col`}>
                <div>
                    You have successfully booked <span className="text-gold font-medium">${amountLocale}</span> allocation in <span className="font-bold text-gold ">{offer.name}</span>.
                </div>
                <div className="pt-10 pb-5 flex flex-col items-center">
                    <div className="pb-2">Your allocation is safely booked for</div>
                    <FlipClockCountdown
                        className="flip-clock"
                        onComplete={() => bookingExpire()}
                        to={moment.unix(expires)}
                        labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
                        labelStyle={{fontSize: 10, fontWeight: 500, textTransform: 'uppercase', color: 'white'}}
                    />
                    <div className="mt-5"><strong>No need for gas wars!</strong></div>
                    <div>Execute transactions carefully.</div>
                </div>
                <div className="flex flex-col flex-1 gap-2 pb-2 justify-content">

                    {/*{ACL === ACLs.Whale &&*/}
                    {/*    <StakeStep stepProps={{...stepProps, ...stepStakeProps}} />*/}
                    {/*}*/}
                        <LiquidityStep stepProps={liquidityProps} />
                        <TransactionStep stepProps={transactionProps}/>
                </div>
                <div className={` pb-5 ${isBased ? "fullWidth": "flex flex-1 justify-center"}`}>
                    <UniButton
                        type={ButtonTypes.BASE}
                        isWide={true}
                        size={'text-sm sm'}
                        text={buttonText}
                        state={"danger"}
                        icon={<RocketIcon className={ButtonIconSize.hero}/>}
                        isDisabled={!liquidity || isTransactionLoading !== TransactionState.Init}
                        handler={()=> { run() }}/>
                </div>
                <div>Booked allocation will be released when the timer runs to zero. <Linker url={ExternalLinks.BOOKING_SYSTEM}/>
                </div>
            </div>
        )
    }


    const content = () => {
       return transaction ? contentSuccess() : contentSteps()
    }

    return (<GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} persistent={true}/>)
}

