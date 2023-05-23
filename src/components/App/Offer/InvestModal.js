import GenericModal from "@/components/Modal/GenericModal";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import moment from "moment";
import {useState , useEffect} from "react";
import TransactStep from "@/components/App/Transactions/TransactStep";
import LiquidityStep from "@/components/App/Transactions/LiquidityStep";
import {RoundButton} from "@/components/Button/RoundButton";
import PAGE from "@/routes";
import Link from "next/link";
import {useSession} from "next-auth/react";
import StakeStep from "@/components/App/Transactions/StakeStep";
import {ACL as ACLs}  from "@/lib/acl";
import {getInvestFunction} from "@/components/App/Transactions/TransactionSteps";

export const StakeSteps = {
    Select: 0,
    Use: 1,
    Skip: 2
}

export default function InvestModal({model, setter, investModalProps}) {
    const {expires, investmentAmount, offer, selectedCurrency, hash, afterInvestmentCleanup, bookingExpire} = investModalProps
    const {data: session} = useSession()
    const {ACL, id, address} = session.user

    const [stepStake, setStepStake] = useState(StakeSteps.Select)
    const [stepLiquidity, setStepLiquidity] = useState(false)
    const [stepInvestment, setStepInvestment] = useState(false)
    const [errors, setError] = useState(false)

    const amountLocale = Number(investmentAmount).toLocaleString()

    const usingStakedFunds = stepStake === StakeSteps.Use
    const stepLiquidityReady = (ACL === ACLs.Whale && stepStake === StakeSteps.Skip) || ACL !== ACLs.Whale
    const stepLiquidityFinished = stepLiquidity || usingStakedFunds

    const investFunction = getInvestFunction(ACL, usingStakedFunds, investmentAmount, offer, selectedCurrency, hash, id)

    useEffect(() => {
        import('@lottiefiles/lottie-player');
    }, []);


    const closeModal = () => {
        setter()
        if(stepInvestment) {
            afterInvestmentCleanup()
        }
        setTimeout(() => {
            setStepStake(StakeSteps.Select)
            setStepLiquidity(false)
            setStepInvestment(false)
        }, 1000);
    }

    const stepProps = {
        ...{amount: investmentAmount},
        offer,
        selectedCurrency,
        hash,
        session
    }

    const stepStakeProps = {
        stepStake,
        setStepStake,
    }

    const stepLiquidityProps = {
        isReady: stepLiquidityReady,
        isFinished: stepLiquidityFinished,
        setFinished: setStepLiquidity,
        ...stepProps
    }


    const stepTransactProps = {
        isReady: stepLiquidityFinished,
        isFinished: stepInvestment,
        setFinished: setStepInvestment,
        writeFunction: investFunction,
        errorHandler: setError,
        userAddress: address,
        ...stepProps
    }


    const title = () => {
        return (
            <>
                {stepInvestment ?
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
                <lottie-player
                    autoplay
                    loop
                    style={{width: '320px', margin: '30px auto 0px'}}
                    mode="normal"
                    src="/static/lottie/success.json"
                />
                <div className="flex flex-1 justify-center items-center py-10 fullWidth">
                    <Link href={PAGE.Vault} className={" w-full fullWidth"}>
                        <RoundButton text={'Check Vault'} isLoading={false} isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'} />
                    </Link>
                </div>
                <div className="mt-auto"><a href="#" target="_blank" className="text-outline">What's next? Read more.</a></div>
            </div>
        )
    }
    const contentSteps = () => {
        return (
            <div className="flex flex-1 flex-col">
                <div>You have successfully booked <span
                    className="text-gold font-medium">${amountLocale}</span> allocation
                    in <span className="font-bold">{offer.name}</span>.
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

                    {ACL === ACLs.Whale &&
                        <StakeStep stepProps={{...stepProps, ...stepStakeProps}} />
                    }
                        <LiquidityStep stepProps={{...stepProps, ...stepLiquidityProps}} />
                        <TransactStep stepProps={{...stepProps, ...stepTransactProps}}/>
                </div>
                <div className="">Booked allocation will be released when the timer runs to zero. <a
                    href="#" target="_blank" className="text-app-error">Read more.</a></div>
            </div>
        )
    }


    const content = () => {
       return stepInvestment ? contentSuccess() : contentSteps()
    }

    return (<GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} persistent={true}/>)
}

