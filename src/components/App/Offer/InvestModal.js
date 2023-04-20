import GenericModal from "@/components/Modal/GenericModal";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import moment from "moment";
import {useState} from "react";
import AllowanceStep from "@/components/App/Transactions/AllowanceStep";
import InvestStep from "@/components/App/Transactions/InvestStep";
import LiquidityStep from "@/components/App/Transactions/LiquidityStep";
import {useEffect} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconVault from "@/assets/svg/Vault.svg";
import PAGE from "@/routes";
import Link from "next/link";
import {useSession} from "next-auth/react";
import StakeStep from "@/components/App/Transactions/StakeStep";
import {ACL as ACLs}  from "@/lib/acl";

export default function InvestModal({model, setter, expires, amount, offer, currency, expireHandle, hash, afterInvestment}) {
    const {data: session} = useSession()
    const {ACL} = session.user

    const [stakeReady, setStake] = useState(0)
    const [liquidityReady, setLiquidity] = useState(false)
    const [allowanceReady, setAllowance] = useState(false)
    const [success, setSuccess] = useState("")

    const amountLocale = amount.toLocaleString()
    const liquidityStart = (ACL === ACLs.Whale && stakeReady !== 0) || ACL !== ACLs.Whale
    console.log("liquidityStart",liquidityStart,liquidityReady, allowanceReady)


    const cleanModalEnv = (triggerViewCleanup) => {
        if(triggerViewCleanup) {
            afterInvestment()
        }
        setStake(0)
        setLiquidity(false)
        setAllowance(false)
        setSuccess("")
    }

    const closeModal = () => {
        setter()
        if(success.length > 0) {
            cleanModalEnv(true)
        }
    }


    useEffect(() => {
        if (!model) {
            cleanModalEnv()
        }
    }, [model])


    const title = () => {
        return (
            <>
                {success.length === 0 ?
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

                <div className="mt-5">Visit <span className="text-gold font-medium">Vault</span> page to see your portfolio.</div>
                <div className="">You can find there updates about your investments and claim assets.</div>
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
                        onComplete={expireHandle}
                        to={moment.unix(expires)}
                        labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
                        labelStyle={{fontSize: 10, fontWeight: 500, textTransform: 'uppercase', color: 'white'}}
                    />
                    <div className="mt-5"><strong>No need for gas wars!</strong></div>
                    <div>Execute transactions carefully.</div>
                </div>
                <div className="flex flex-col gap-2 pb-5 justify-content">
                    {ACL === ACLs.Whale && <StakeStep amount={amount} offer={offer} isReady={true} confirmSuccess={setStake}/> }
                    <LiquidityStep amount={amount} currency={currency} isReady={liquidityStart}
                                   confirmSuccess={() => setLiquidity(true)}/>
                    <AllowanceStep amount={amount} spender={offer.diamond} currency={currency} isReady={liquidityReady}
                                   confirmSuccess={() => setAllowance(true)}/>
                    <InvestStep amount={amount} currency={currency} offer={offer} hash={hash} isFromStake={stakeReady===1}
                                isReady={allowanceReady} confirmSuccess={setSuccess}/>
                </div>
                <div className="">Booked allocation will be released when the timer runs to zero. <a
                    href="#" target="_blank" className="text-app-error">Read more.</a></div>
            </div>
        )
    }

    const content = () => {
       return success.length>0 ? contentSuccess() : contentSteps()
    }


    return (<GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} persistent={true}/>)
}

