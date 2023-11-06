import GenericModal from "@/components/Modal/GenericModal";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import moment from "moment";
import {useState, useRef } from "react";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import PAGE, {ExternalLinks} from "@/routes";
import Link from "next/link";
import Linker from "@/components/link";
import {getInvestFunction} from "@/components/App/BlockchainSteps/config";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {isBased} from "@/lib/utils";
import RocketIcon from "@/assets/svg/Rocket.svg";
import Lottie from "lottie-react";
import lottieSuccess from "@/assets/lottie/success.json";
import BlockchainSteps from "@/components/App/BlockchainSteps";

export const StakeSteps = {
    Select: 0,
    Use: 1,
    Skip: 2
}

export default function InvestModal({model, setter, investModalProps}) {
    const {account, expires, investmentAmount, offer, selectedCurrency, hash, afterInvestmentCleanup, bookingExpire} = investModalProps


    const [blockchainData, setBlockchainData] = useState(false)

    const {transactionData} = blockchainData
    const blockchainRef = useRef();

    if(!selectedCurrency) return

    const amountLocale = Number(investmentAmount).toLocaleString()
    const investFunction = getInvestFunction(account.ACL, false, investmentAmount, offer, selectedCurrency, hash, account.id)

    const closeModal = () => {
        setter()
        if(transactionData?.transferConfirmed) {
            afterInvestmentCleanup()
        }
        setTimeout(() => {
            setBlockchainData(false)
        }, 400);
    }


    const blockchainProps = {
        processingData: {
            amount: investmentAmount,
            userWallet: account.address,
            currency: selectedCurrency,
            transactionData: investFunction
        },
        buttonData: {
            // buttonFn,
            icon: <RocketIcon className={ButtonIconSize.hero}/>,
            text: "Transfer funds",
        },
        checkLiquidity: true,
        checkTransaction: true,
        showButton: true,
        saveData: true,
        saveDataFn: setBlockchainData,
    }

    const title = () => {
        return (
            <>
                {transactionData?.transferConfirmed ?
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
                <Lottie animationData={lottieSuccess} loop={true} autoplay={true} style={{width: '320px', margin: '30px auto 0px'}}/>

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

                <BlockchainSteps ref={blockchainRef} blockchainProps={blockchainProps}/>

                <div>Booked allocation will be released when the timer runs to zero. <Linker url={ExternalLinks.BOOKING_SYSTEM}/>
                </div>
            </div>
        )
    }


    const content = () => {
       return transactionData?.transferConfirmed ? contentSuccess() : contentSteps()
    }

    return (<GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} persistent={true}/>)
}

