import moment from "moment";
import { useMemo, useState, useEffect } from "react";
import Lottie from "lottie-react";
import { useRouter } from "next/router";
import GenericModal from "@/components/Modal/GenericModal";
import PAGE from "@/routes";
import Linker from "@/components/link";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import lottieSuccess from "@/assets/lottie/success.json";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { useInvestContext } from "@/components/App/Offer/InvestContext";
import BlockchainSteps from "@/components/BlockchainSteps";
import { METHOD } from "@/components/BlockchainSteps/utils";
import useGetToken from "@/lib/hooks/useGetToken";
import CustomFlipClockCountdown from "@/components/FlipClockCountdown";
import { getTenantConfig } from "@/lib/tenantHelper";

const { externalLinks } = getTenantConfig();

export default function InvestModal({ model, setter, investModalProps }) {
    const router = useRouter();
    const { investmentAmount, offer, selectedCurrency, bookingExpire, afterInvestmentCleanup, partnerId } =
        investModalProps;

    const { account, activeInvestContract } = useEnvironmentContext();

    const { bookingDetails, clearBooking } = useInvestContext();

    const [transactionSuccessful, setTransactionSuccessful] = useState(false);
    const amountLocale = Number(investmentAmount).toLocaleString();

    const closeModal = async (redirectToVault) => {
        setter();
        if (transactionSuccessful) {
            await afterInvestmentCleanup();
        }
        setTimeout(() => {
            setTransactionSuccessful(false);
        }, 400);

        if (redirectToVault) {
            router.push(PAGE.App);
        }
    };

    useEffect(() => {
        if (transactionSuccessful) {
            clearBooking();
        }
    }, [transactionSuccessful]);

    const token = useGetToken(selectedCurrency?.contract);

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                liquidity: true,
                allowance: true,
                transaction: true,
            },
            params: {
                liquidity: Number(investmentAmount),
                allowance: Number(investmentAmount),
                amount: Number(investmentAmount),
                account: account.address,
                booking: bookingDetails,
                offerId: offer.id,
                partnerId,
                spender: activeInvestContract,
                buttonText: "Transfer funds",
                prerequisiteTextWaiting: "Generate hash",
                prerequisiteTextProcessing: "Generating hash",
                prerequisiteTextSuccess: "Hash obtained",
                prerequisiteTextError: "Couldn't generate hash",
                transactionType: METHOD.INVEST,
            },
            token,
            setTransactionSuccessful,
        };
    }, [investmentAmount, account, token?.contract, bookingDetails?.code, model, activeInvestContract]);

    const title = () => {
        return (
            <>
                {transactionSuccessful ? (
                    <>
                        Investment <span className="text-app-success">successful</span>
                    </>
                ) : (
                    <>
                        Booking <span className="text-app-success">success</span>
                    </>
                )}
            </>
        );
    };

    const contentSuccess = () => {
        return (
            <div className="flex flex-col flex-1">
                <div>
                    Congratulations! You have successfully invested{" "}
                    <span className="text-app-success font-bold">${amountLocale}</span> in{" "}
                    <span className="font-bold text-app-success">{offer.name}</span>.
                </div>
                <Lottie
                    animationData={lottieSuccess}
                    loop={true}
                    autoplay={true}
                    style={{ width: "320px", margin: "30px auto 0px" }}
                />

                <div className="flex flex-1 justify-center items-center py-10 fullWidth">
                    <div className="w-full fullWidth" onClick={() => closeModal(true)}>
                        <UniButton
                            type={ButtonTypes.BASE}
                            text="Check Vault"
                            state="danger"
                            isLoading={false}
                            isDisabled={false}
                            is3d={false}
                            isWide={true}
                            zoom={1.1}
                            size="text-sm sm"
                        />
                    </div>
                </div>
                <div className="mt-auto">
                    What's next? <Linker url={externalLinks.AFTER_INVESTMENT} />
                </div>
            </div>
        );
    };
    const contentSteps = () => {
        return (
            <div className="flex flex-1 flex-col">
                <div>
                    You have successfully booked <span className="text-gold font-medium">${amountLocale}</span>{" "}
                    allocation in <span className="font-bold text-gold ">{offer.name}</span>.
                </div>
                <div className="pt-10 pb-5 flex flex-col items-center">
                    <div className="pb-2">Complete transfer in the next</div>
                    <CustomFlipClockCountdown
                        className="flip-clock"
                        onComplete={() => bookingExpire()}
                        to={moment.unix(bookingDetails.expires).valueOf()}
                        labels={["DAYS", "HOURS", "MINUTES", "SECONDS"]}
                        labelStyle={{
                            fontSize: 10,
                            fontWeight: 500,
                            textTransform: "uppercase",
                            color: "white",
                        }}
                    />
                </div>

                {model && <BlockchainSteps data={blockchainInteractionData} />}
                <div>
                    Booked allocation will be released when the timer runs to zero.{" "}
                    <Linker url={externalLinks.BOOKING_SYSTEM} />
                </div>
            </div>
        );
    };

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentSteps();
    };

    return (
        <GenericModal
            isOpen={model}
            closeModal={() => closeModal()}
            title={title()}
            content={content()}
            persistent={true}
        />
    );
}
