import GenericModal from "@/components/Modal/GenericModal";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import moment from "moment";
import {useState , useEffect} from "react";
import AllowanceStep from "@/components/App/Transactions/AllowanceStep";
import TransactStep from "@/components/App/Transactions/TransactStep";
import LiquidityStep from "@/components/App/Transactions/LiquidityStep";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconVault from "@/assets/svg/Vault.svg";
import PAGE from "@/routes";
import Link from "next/link";
import {useSession} from "next-auth/react";
import StakeStep from "@/components/App/Transactions/StakeStep";
import {ACL as ACLs}  from "@/lib/acl";
import VanillaTilt from "vanilla-tilt";

export const StakeSteps = {
    Select: 0,
    Use: 1,
    Skip: 2
}

export default function InvestModal({model, setter, investModalProps}) {
    const {expires, investmentSize, offer, selectedCurrency, hash, afterInvestmentCleanup, bookingExpire} = investModalProps
    const {data: session} = useSession()
    const {ACL} = session.user

    const [stepStake, setStepStake] = useState(StakeSteps.Select)
    const [stepLiquidity, setStepLiquidity] = useState(false)
    const [stepAllowance, setStepAllowance] = useState(false)
    const [stepInvestment, setStepInvestment] = useState(false)
    const [transactionData, setTransactionData] = useState("")

    const amountLocale = investmentSize.toLocaleString()


    const stepLiquidityReady = (ACL === ACLs.Whale && stepStake === StakeSteps.Skip) || ACL !== ACLs.Whale
    const stepLiquidityFinished = stepLiquidity || stepStake === StakeSteps.Use
    const stepAllowanceFinished = stepAllowance || stepStake === StakeSteps.Use

    useEffect(() => {
        import('@lottiefiles/lottie-player');
    }, []);


    const closeModal = () => {
        setter()
        if(transactionData.length > 0) {
            afterInvestmentCleanup()
        }
        setTimeout(() => {
            setStepStake(StakeSteps.Select)
            setStepLiquidity(false)
            setStepAllowance(false)
            setStepInvestment(false)
            setTransactionData("")
        }, 1000);

    }


    const stepProps = {
        ...{amount: investmentSize},
        offer,
        selectedCurrency,
        hash,
    }

    const stepStakeProps = {
        stepStake,
        setStepStake,
    }

    const stepLiquidityProps = {
        ...stepProps,
        stepLiquidityFinished, //as stepLiquidity extension
        setStepLiquidity,
        stepLiquidityReady,
    }

    const stepAllowanceProps = {
        ...stepProps,
        stepAllowanceFinished,//as stepLiquidity extension
        setStepAllowance,
        ...{stepAllowanceReady: stepLiquidityFinished},
        ...{spender: offer.diamond}
    }
    const stepInvestProps = {
        ...stepProps,
        stepInvestment,
        setStepInvestment,
        setTransactionData,
        ...{stepInvestmentReady: stepAllowanceFinished},
        ...{isFromStake: stepStake===StakeSteps.Use}
    }


    const title = () => {
        return (
            <>
                {transactionData.length === 0 ?
                    <>Booking <span className="text-app-success">success</span></>
                    :
                    <>Investment <span className="text-app-success">successful</span></>
                }
            </>
        )
    }

    const contentSuccess = () => {
        return (
            <div className="min-h-[442px] flex flex-col flex-1">
                <div>Congratulations! You have successfully invested <span className="text-app-success font-bold">${amountLocale}</span> in <span className="font-bold text-app-success">{offer.name}</span>.</div>
                <lottie-player
                    autoplay
                    loop
                    style={{width: '320px', margin: '30px auto 0px'}}
                    mode="normal"
                    src="/static/lottie/success.json"
                />
                <div className="flex flex-1 justify-center items-center">
                    <Link href={PAGE.Vault}>
                        <RoundButton text={'Check Vault'} isLoading={false} isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<IconVault className={ButtonIconSize.hero}/> } />
                    </Link>
                </div>
                <div className="mt-auto"><a href="#" target="_blank" className="text-outline">What's next? Read more.</a></div>
            </div>
        )
    }
    const contentSteps = () => {
        return (
            <div className="min-h-[442px]">
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
                <div className="flex flex-col gap-2 pb-5 justify-content">

                    {ACL === ACLs.Whale &&
                        <StakeStep stepProps={{...stepProps, ...stepStakeProps}} />
                    }
                        <LiquidityStep stepProps={{...stepProps, ...stepLiquidityProps}} />
                        <AllowanceStep stepProps={{...stepProps, ...stepAllowanceProps}} />
                        <TransactStep stepProps={{...stepProps, ...stepInvestProps}}/>
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

