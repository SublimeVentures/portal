import GenericModal from "@/components/Modal/GenericModal";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import moment from "moment";
import {useEffect} from "react";
import PAGE, {ExternalLinks} from "@/routes";
import Linker from "@/components/link";
import { INTERACTION_TYPE} from "@/components/App/BlockchainSteps/config";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {isBased} from "@/lib/utils";
import RocketIcon from "@/assets/svg/rocket.svg";
import Lottie from "lottie-react";
import lottieSuccess from "@/assets/lottie/success.json";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import {useRouter} from "next/router";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";
import {useInvestContext} from "@/components/App/Offer/InvestContext";


export default function InvestModal({model, setter, investModalProps}) {
    const router = useRouter()
    const {
        investmentAmount,
        offer,
        selectedCurrency,
        bookingExpire,
        afterInvestmentCleanup,
    } = investModalProps

    const {
        insertConfiguration,
        blockchainCleanup,
        blockchainProps,
    } = useBlockchainContext();

    const {
        account,
    } = useEnvironmentContext();

    const {
        hashData,
    } = useInvestContext();

    const transactionSuccessful = blockchainProps.result.transaction?.confirmation_data


    const amountLocale = Number(investmentAmount).toLocaleString()

    const closeModal = () => {
        setter()
        if (transactionSuccessful) {
            afterInvestmentCleanup()
        }
        setTimeout(() => {
            blockchainCleanup()
        }, 400);
    }

    const redirectToVault = () => {
        closeModal()
        router.push(PAGE.App)
    }

    useEffect(() => {
        if (investmentAmount < 50 || !model || !hashData?.code || hashData?.code?.length === 0 || !selectedCurrency || !blockchainProps.isClean) return;
        insertConfiguration({
            data: {
                account: account.address,
                liquidity: investmentAmount,
                currency: selectedCurrency,
                buttonIcon: <RocketIcon className="w-10 mr-2"/>, // Adjust class as needed
                buttonText: "Transfer funds",
                transactionType: INTERACTION_TYPE.INVEST,
                vault: offer.vault,
            },
            steps: {
                liquidity: true,
                transaction: true,
            }
        });
    }, [
        investmentAmount,
        selectedCurrency,
        hashData?.code,
        model
    ]);

    if (!selectedCurrency) return


    const title = () => {
        return (
            <>
                {transactionSuccessful ?
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
                <div>Congratulations! You have successfully invested <span
                    className="text-app-success font-bold">${amountLocale}</span> in <span
                    className="font-bold text-app-success">{offer.name}</span>.
                </div>
                <Lottie animationData={lottieSuccess} loop={true} autoplay={true}
                        style={{width: '320px', margin: '30px auto 0px'}}/>

                <div className="flex flex-1 justify-center items-center py-10 fullWidth">
                    <div className={` w-full fullWidth ${isBased ? "" : "flex flex-1 justify-center"}`}
                         onClick={redirectToVault}>
                        <UniButton type={ButtonTypes.BASE} text={'Check Vault'} state={"danger"} isLoading={false}
                                   isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'}/>
                    </div>
                </div>
                <div className="mt-auto">What's next? <Linker url={ExternalLinks.AFTER_INVESTMENT}/></div>
            </div>
        )
    }
    const contentSteps = () => {
        return (
            <div className={`flex flex-1 flex-col`}>
                <div>
                    You have successfully booked <span
                    className="text-gold font-medium">${amountLocale}</span> allocation in <span
                    className="font-bold text-gold ">{offer.name}</span>.
                </div>
                <div className="pt-10 pb-5 flex flex-col items-center">
                    <div className="pb-2">Complete transfer in the next</div>
                    <FlipClockCountdown
                        className="flip-clock"
                        onComplete={() => bookingExpire()}
                        to={moment.unix(hashData.expires)}
                        labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
                        labelStyle={{fontSize: 10, fontWeight: 500, textTransform: 'uppercase', color: 'white'}}
                    />

                </div>

                <BlockchainSteps/>
                <div>Booked allocation will be released when the timer runs to zero. <Linker
                    url={ExternalLinks.BOOKING_SYSTEM}/>
                </div>
            </div>
        )
    }


    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentSteps()
    }

    return (
        <GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} persistent={true}/>)
}

