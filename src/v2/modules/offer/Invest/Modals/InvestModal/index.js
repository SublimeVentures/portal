import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Lottie from "lottie-react";
import moment from "moment";
import { useQueryClient } from "@tanstack/react-query";
import CurrencySwitch from "./CurrencySwitch";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import useGetToken from "@/lib/hooks/useGetToken";
import { useOfferDetailsQuery } from "@/v2/modules/offer/queries";
import { useOfferDetailsStore } from "@/v2/modules/offer/store";
import useInvestContext from "@/v2/modules/offer/useInvestContext";
import Countdown from "@/v2/components/Countdown";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogDescription,
    DialogTitle,
} from "@/v2/components/ui/dialog";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import { METHOD } from "@/v2/components/BlockchainSteps/utils";
import lottieSuccess from "@/assets/lottie/success.json";
import { routes } from "@/v2/routes";
import { Button } from "@/v2/components/ui/button";
import { ExternalLinks } from "@/routes";
import MutedText from "@/v2/components/ui/muted-text";
import ExternalLink from "@/v2/components/ui/external-link";
import { vaultKeys } from "@/v2/constants";

const InvestModalContent = ({
    open,
    investmentAmount,
    currency,
    handleCurrencyChange,
    afterInvestmentCleanup,
    bookingExpire,
    onOpenChange,
}) => {
    const router = useRouter();
    const { account, activeInvestContract, getCurrencySettlement } = useEnvironmentContext();
    const { clearBooking, getSavedBooking } = useInvestContext();
    const client = useQueryClient();

    const dropdownCurrencyOptions = getCurrencySettlement();
    const { partnerId } = useOfferDetailsStore();
    const { data: offer } = useOfferDetailsQuery();
    const bookingDetails = getSavedBooking();

    const [transactionSuccessful, setTransactionSuccessful] = useState(false);
    const amountNumber = Number(investmentAmount);
    const amountLocale = amountNumber.toLocaleString();

    const handleSetTransactionSuccess = () => {
        setTransactionSuccessful(true);
        clearBooking();
        client.invalidateQueries({
            queryKey: vaultKeys.vault(),
        });
    };

    const handleCloseModal = async (redirectToVault = false) => {
        onOpenChange(false);
        if (transactionSuccessful) await afterInvestmentCleanup();
        setTimeout(() => setTransactionSuccessful(false), 400);
        if (redirectToVault) router.push(routes.App);
    };

    const selectedCurrency = dropdownCurrencyOptions.find((c) => c.symbol === currency);
    const token = useGetToken(selectedCurrency?.contract);

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                liquidity: true,
                allowance: true,
                transaction: true,
            },
            params: {
                liquidity: amountNumber,
                allowance: amountNumber,
                amount: amountNumber,
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
            setTransactionSuccessful: handleSetTransactionSuccess,
        };
    }, [amountNumber, account, token?.contract, bookingDetails?.code, open, activeInvestContract]);

    const { getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({
        data: blockchainInteractionData,
        deps: [open],
    });

    return (
        <DialogContent handleClose={handleCloseModal}>
            <DialogHeader className="md:items-center">
                <DialogTitle className="text-center flex items-center justify-center">
                    {transactionSuccessful ? "Investment Successful" : "Booking Success"}
                </DialogTitle>
                <DialogDescription className="max-w-80 md:text-center">
                    {transactionSuccessful ? (
                        <>
                            Congratulations! You have successfully invested{" "}
                            <span className="text-green-500">${amountLocale}</span> in{" "}
                            <span className="text-green-500 uppercase">{offer.name}</span>.
                        </>
                    ) : (
                        <>
                            You have successfully booked <span className="text-green-500">${amountLocale}</span>{" "}
                            allocation in <span className="text-green-500 uppercase">{offer.name}</span>
                        </>
                    )}
                </DialogDescription>
            </DialogHeader>

            {transactionSuccessful ? (
                <Lottie
                    animationData={lottieSuccess}
                    loop={true}
                    autoplay={true}
                    style={{ width: "320px", margin: "30px auto 0px" }}
                />
            ) : (
                <>
                    <div className="p-4 flex flex-col items-center border border-white rounded">
                        <h4 className="pb-2 text-xl text-white">Complete transfer in the next</h4>
                        <Countdown
                            countStart={moment.unix(bookingDetails.expires).valueOf()}
                            onComplete={bookingExpire}
                            units={{ minutes: "m :", seconds: "s" }}
                            className="text-2xl"
                        />
                    </div>

                    <CurrencySwitch currency={currency} handleCurrencyChange={handleCurrencyChange} />
                    <BlockchainSteps {...getBlockchainStepsProps()} />
                </>
            )}

            <DialogFooter className="flex items-center">
                {transactionSuccessful ? (
                    <>
                        <Button asChild>
                            <Link href={routes.App}>Check Vault</Link>
                        </Button>
                        <MutedText className="max-w-72">
                            What's next? <ExternalLink href={ExternalLinks.AFTER_INVESTMENT}>Read more</ExternalLink>
                        </MutedText>
                    </>
                ) : (
                    <>
                        <BlockchainStepButton className="w-full md:w-64" {...getBlockchainStepButtonProps()} />
                        <MutedText className="max-w-72">
                            Booked allocation will be released when the timer runs to zero.{" "}
                            <ExternalLink href={ExternalLinks.BOOKING_SYSTEM}>Read more</ExternalLink>
                        </MutedText>
                    </>
                )}
            </DialogFooter>
        </DialogContent>
    );
};

export default function InvestModal(props) {
    const { open, onOpenChange, currency } = props;
    const { network } = useEnvironmentContext();

    const shouldOpenModal = network?.isSupported && !!currency;

    if (!shouldOpenModal) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <InvestModalContent {...props} />
        </Dialog>
    );
}
