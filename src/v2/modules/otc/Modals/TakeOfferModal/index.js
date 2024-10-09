import { useState } from "react";
import Image from "next/image";
import { ChevronRightIcon } from "@radix-ui/react-icons";

import TransactionSuccess from "../TransactionSucces";
import useBlockchainTakeOfferTransaction from "./useBlockchainTakeOfferTransaction";
import useMarket from "@/v2/modules/otc/logic/useMarket";
import { Button } from "@/v2/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetBody,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/v2/components/ui/sheet";
import { DynamicIcon } from "@/v2/components/ui/dynamic-icon";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { queryClient } from "@/lib/queryCache";
import { NETWORKS } from "@/lib/utils";
import { cn } from "@/lib/cn";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import MutedText from "@/v2/components/ui/muted-text";

export default function TakeOfferModal({ offerDetails, className }) {
    const [isTakeModalOpen, setIsTakeModalOpen] = useState(false);

    const { currentMarket } = useMarket();
    const { getCurrencySymbolByAddress, network, otcFee, cdn } = useEnvironmentContext();

    const { totalPayment, transactionSuccessful, blockchainInteractionData, setTransactionSuccessful } =
        useBlockchainTakeOfferTransaction({ offerDetails });

    const { resetState, getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({
        data: blockchainInteractionData,
        deps: [isTakeModalOpen],
    });

    if (!currentMarket?.name || !offerDetails?.currency) return;

    const chainDesired = network.chains?.find((el) => el.id === offerDetails?.chainId);
    const cancelOfferAmount_parsed = offerDetails?.amount?.toLocaleString();
    const cancelOfferPrice_parsed = offerDetails?.price?.toLocaleString();

    const handleModalClose = async () => {
        if (transactionSuccessful)
            await Promise.all([
                queryClient.invalidateQueries(["otcOffers"]),
                queryClient.invalidateQueries(["userAllocation"]),
            ]).finally(() => setTransactionSuccessful(false));
        else setTransactionSuccessful(false);

        resetState();
    };

    return (
        <Sheet open={isTakeModalOpen} onOpenChange={setIsTakeModalOpen}>
            <SheetTrigger asChild>
                <Button variant="accent" className={className}>
                    Take
                    <ArrowIcon className="ml-2 w-2 h-2" />
                </Button>
            </SheetTrigger>

            <SheetContent className="h-full flex flex-col rounded-t-lg" onCloseAutoFocus={handleModalClose}>
                <SheetHeader>
                    <Image
                        src={`${cdn}/research/${currentMarket.slug}/icon.jpg`}
                        className="inline mx-2 rounded-full"
                        alt=""
                        width={100}
                        height={100}
                    />
                    <SheetTitle>{currentMarket.name}</SheetTitle>
                    <SheetDescription>{currentMarket.genre}</SheetDescription>
                </SheetHeader>

                <SheetBody>
                    <div className="mx-10 my-4 sm:px-10">
                        <div className="definition-section">
                            {transactionSuccessful ? (
                                <TransactionSuccess
                                    title="OTC Offer filled"
                                    description="You have successfully filled OTC offer."
                                />
                            ) : (
                                <>
                                    <h3 className="text-base md:text-lg font-medium text-foreground text-center">
                                        Take OTC Offer
                                    </h3>
                                    <p className="mb-2 text-sm font-light text-foreground text-center">
                                        {offerDetails.isSell
                                            ? "Are you sure you want to buy allocation from this SELL offer?"
                                            : "Are you sure you want to sell your allocation to this BUY offer?"}
                                    </p>
                                    <dl className="definition-grid">
                                        <DefinitionItem term="Market">{currentMarket.name}</DefinitionItem>
                                        <DefinitionItem term="Type">
                                            <span
                                                className={cn({
                                                    "text-error-500": offerDetails.isSell,
                                                    "text-success-500": !offerDetails.isSell,
                                                })}
                                            >
                                                {offerDetails.isSell ? "Sell" : "Buy"}
                                            </span>
                                        </DefinitionItem>
                                        <DefinitionItem term="Blockchain">
                                            <DynamicIcon
                                                className="size-6 inline mx-2 rounded-full"
                                                name={NETWORKS[chainDesired?.id]}
                                            />
                                            <span>{chainDesired?.name}</span>
                                        </DefinitionItem>
                                        <DefinitionItem term="Amount">${cancelOfferAmount_parsed}</DefinitionItem>
                                        <DefinitionItem term="Price">${cancelOfferPrice_parsed}</DefinitionItem>
                                        <DefinitionItem term="Fees">${otcFee}</DefinitionItem>
                                    </dl>
                                </>
                            )}
                        </div>

                        <BlockchainSteps {...getBlockchainStepsProps()} />

                        <div>
                            <h3 className="pb-2 pt-4 px-8 text-base font-medium text-foreground hidden md:block">
                                Overview
                            </h3>
                            <div className="py-4 px-8 flex justify-between items-center bg-foreground/[.1]">
                                <div className="flex items-center">
                                    <DynamicIcon
                                        className="mx-2 size-8 inline text-white rounded-full"
                                        name={getCurrencySymbolByAddress(offerDetails.currency)}
                                    />
                                    <dl className="flex flex-col gap-2">
                                        <DefinitionItem term="You Pay">${totalPayment}</DefinitionItem>
                                    </dl>
                                </div>
                                <ChevronRightIcon className="text-foreground" />
                                <div className="flex items-center">
                                    <Image
                                        src={`${cdn}/research/${currentMarket.slug}/icon.jpg`}
                                        className="inline mx-2 rounded-full"
                                        alt={`Cover image of token`}
                                        width={35}
                                        height={35}
                                    />
                                    <dl className="flex flex-col gap-2">
                                        <DefinitionItem term="You Recieve">
                                            {offerDetails.amount / currentMarket.ppu}
                                        </DefinitionItem>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </SheetBody>

                <SheetFooter>
                    {transactionSuccessful ? (
                        <SheetClose asChild>
                            <Button variant="accent">Close</Button>
                        </SheetClose>
                    ) : (
                        <BlockchainStepButton {...getBlockchainStepButtonProps()} />
                    )}
                    <MutedText>
                        You will automatically receive ${currentMarket.ticker} tokens after settlement.
                    </MutedText>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
