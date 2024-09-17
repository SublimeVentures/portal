import { useState } from "react";
import Lottie from "lottie-react";

import { cn } from "@/lib/cn";
import Countdown from "@/v2/components/Countdown";
import { Button } from "@/v2/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/v2/components/ui/dialog";
import lottieSuccess from "@/assets/lottie/success.json";

const amount = "100";
const ticker = "gunzilla";
const amountLocale = 100;
const offer = { name: "gunzilla" };

const CurrencySwitch = () => {
    const [selectedCurrency, setSelectedCurrency] = useState("usdt");
    const handleChange = (event) => setSelectedCurrency(event.target.value);
    return (
        <div className="flex items-center w-full border border-primary rounded">
            <label
                htmlFor="usdt"
                className={cn(
                    "p-2 relative w-full font-light text-foreground/50 bg-transparent text-center cursor-pointer",
                    { "text-foreground bg-primary": selectedCurrency === "usdt" },
                )}
            >
                <input
                    type="radio"
                    id="usdt"
                    name="currency"
                    value="usdt"
                    checked={selectedCurrency === "usdt"}
                    onChange={handleChange}
                    className="absolute opacity-0"
                />
                USDT
            </label>
            <label
                htmlFor="usdc"
                className={cn(
                    "p-2 relative w-full font-light text-foreground/50 bg-transparent text-center cursor-pointer",
                    { "text-foreground bg-primary": selectedCurrency === "usdc" },
                )}
            >
                <input
                    type="radio"
                    id="usdc"
                    name="currency"
                    value="usdc"
                    checked={selectedCurrency === "usdc"}
                    onChange={handleChange}
                    className="absolute opacity-0"
                />
                USDC
            </label>
        </div>
    );
};

export default function CalculateModal() {
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="gradient">invest modal</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader className="md:items-center">
                    <DialogTitle className="text-center flex items-center justify-center">
                        {transactionSuccessful ? "Investment successful" : "Booking success"}
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
                        <div className="p-4 flex flex-col items-center border border-foreground rounded">
                            <h4 className="pb-2 text-xl text-foreground">Complete transfer in the next</h4>
                            <Countdown
                                countStart={new Date(Date.now() + 15 * 60 * 1000).toISOString()}
                                units={{ minutes: "m :", seconds: "s" }}
                                onComplete={() => {}}
                                // onComplete={() => bookingExpire()}
                                // to={moment.unix(bookingDetails.expires).valueOf()}
                                className="text-2xl"
                            />
                        </div>

                        <CurrencySwitch />

                        {/* <BlockchainStep */}
                    </>
                )}

                <DialogFooter className="flex items-center">
                    <Button className="w-full max-w-96">Transfer Funds</Button>
                    <p className="max-w-72 text-sm text-foreground/50 text-center">
                        Booked allocation will be released when the timer runs to zero. Read more
                        {/* <Linker url={ExternalLinks.BOOKING_SYSTEM} /> */}
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// {network?.isSupported && selectedCurrency && (
//     <InvestModal
//         investModalProps={investModalProps}
//         model={isInvestModal}
//         setter={() => {
//             setInvestModal(false);
//         }}
//     />
// )}

// import moment from "moment";
// import { useMemo, useState, useEffect } from "react";

// import { useRouter } from "next/router";
// import GenericModal from "@/components/Modal/GenericModal";
// import PAGE, { ExternalLinks } from "@/routes";
// import Linker from "@/components/link";
// import { ButtonTypes, UniButton } from "@/components/Button/UniButton";

// import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
// import { useInvestContext } from "@/components/App/Offer/InvestContext";
// import BlockchainSteps from "@/components/BlockchainSteps";
// import { METHOD } from "@/components/BlockchainSteps/utils";
// import useGetToken from "@/lib/hooks/useGetToken";
// import CustomFlipClockCountdown from "@/components/FlipClockCountdown";

// export default function InvestModal({ model, setter, investModalProps }) {
//     const router = useRouter();
//     const { investmentAmount, offer, selectedCurrency, bookingExpire, afterInvestmentCleanup } = investModalProps;

//     const { account, activeInvestContract } = useEnvironmentContext();

//     const { bookingDetails, clearBooking } = useInvestContext();

//     const amountLocale = Number(investmentAmount).toLocaleString();

//     const closeModal = async (redirectToVault) => {
//         setter();
//         if (transactionSuccessful) {
//             await afterInvestmentCleanup();
//         }
//         setTimeout(() => {
//             setTransactionSuccessful(false);
//         }, 400);

//         if (redirectToVault) {
//             router.push(PAGE.App);
//         }
//     };

//     useEffect(() => {
//         if (transactionSuccessful) {
//             clearBooking();
//         }
//     }, [transactionSuccessful]);

//     const token = useGetToken(selectedCurrency?.contract);

//     const blockchainInteractionData = useMemo(() => {
//         return {
//             steps: {
//                 liquidity: true,
//                 allowance: true,
//                 transaction: true,
//             },
//             params: {
//                 liquidity: Number(investmentAmount),
//                 allowance: Number(investmentAmount),
//                 amount: Number(investmentAmount),
//                 account: account.address,
//                 booking: bookingDetails,
//                 offerId: offer.id,
//                 spender: activeInvestContract,
//                 buttonText: "Transfer funds",
//                 prerequisiteTextWaiting: "Generate hash",
//                 prerequisiteTextProcessing: "Generating hash",
//                 prerequisiteTextSuccess: "Hash obtained",
//                 prerequisiteTextError: "Couldn't generate hash",
//                 transactionType: METHOD.INVEST,
//             },
//             token,
//             setTransactionSuccessful,
//         };
//     }, [investmentAmount, account, token?.contract, bookingDetails?.code, model, activeInvestContract]);

//     const contentSteps = () => {
//         return (
//             <div className="flex flex-1 flex-col">

// <div className="pt-10 pb-5 flex flex-col items-center">
//     <div className="pb-2">Complete transfer in the next</div>
//     <CustomFlipClockCountdown
//         className="flip-clock"
//         onComplete={() => bookingExpire()}
//         to={moment.unix(bookingDetails.expires).valueOf()}
//         labels={["DAYS", "HOURS", "MINUTES", "SECONDS"]}
//         labelStyle={{
//             fontSize: 10,
//             fontWeight: 500,
//             textTransform: "uppercase",
//             color: "white",
//         }}
//     />
// </div>

//                 {model && <BlockchainSteps data={blockchainInteractionData} />}
//             </div>
//         );
//     };
