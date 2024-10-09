import { useState } from "react";
import Image from "next/image";

import TransactionSuccess from "../TransactionSucces";
import useBlockchainCancelOfferTransaction from "./useBlockchainCancelOfferTransaction";
import useMarket from "@/v2/modules/otc/logic/useMarket";
import { Button } from "@/v2/components/ui/button";
import {
    Sheet,
    SheetContent,
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
import { cn } from "@/lib/cn";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import { NETWORKS } from "@/lib/utils";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import MutedText from "@/v2/components/ui/muted-text";

const Content = ({ offerDetails, setIsCancelModalOpen, isCancelModalOpen }) => {
    const { currentMarket } = useMarket();
    const { network, cdn } = useEnvironmentContext();

    const { blockchainInteractionData, transactionSuccessful, setTransactionSuccessful } =
        useBlockchainCancelOfferTransaction({
            otcId: currentMarket?.otc,
            dealId: offerDetails?.dealId,
            requiredNetwork: offerDetails?.chainId,
            currency: offerDetails?.currency,
        });

    const { getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({
        data: blockchainInteractionData,
        deps: [isCancelModalOpen],
        setTransactionSuccessful,
    });

    const cancelOfferAmount_parsed = offerDetails?.amount?.toLocaleString();
    const cancelOfferPrice_parsed = offerDetails?.price?.toLocaleString();
    const chainDesired = network?.chains?.find((el) => el.id === offerDetails?.chainId);

    if (transactionSuccessful) {
        queryClient.invalidateQueries(["otcOffers"]);
        queryClient.invalidateQueries(["userAllocation"]);
    }

    return (
        <>
            <SheetHeader>
                <Image
                    src={`${cdn}/research/${currentMarket.slug}/icon.jpg`}
                    className="inline mx-2 rounded-full"
                    alt=""
                    width={100}
                    height={100}
                />
                <SheetTitle>{transactionSuccessful ? "OTC offer cancelled" : "Cancel OTC offer"}</SheetTitle>
            </SheetHeader>

            <SheetBody>
                <div className="mx-10 my-4 sm:px-10">
                    {transactionSuccessful ? (
                        <TransactionSuccess
                            title="OTC Offer cancelled"
                            description="You have successfully cancelled OTC offer."
                        />
                    ) : (
                        <>
                            <div className="definition-section">
                                <h3 className="text-2xl font-medium text-foreground text-center">Cancel OTC Offer</h3>
                                <p className="mb-2 text-md text-foreground text-center">
                                    Are you sure you want to cancel this offer?
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
                                            className="inline size-6 mx-2 rounded-full"
                                            name={NETWORKS[chainDesired?.id]}
                                        />
                                        <span>{chainDesired?.name}</span>
                                    </DefinitionItem>
                                    <DefinitionItem term="Amount">${cancelOfferAmount_parsed}</DefinitionItem>
                                    <DefinitionItem term="Price">${cancelOfferPrice_parsed}</DefinitionItem>
                                    {!offerDetails?.isSell && (
                                        <DefinitionItem term="Funds returned">
                                            <DynamicIcon
                                                className="inline size-8 mx-2 text-white rounded-full"
                                                name={offerDetails?.currency}
                                                style={ButtonIconSize.hero4}
                                            />
                                            <span>${cancelOfferPrice_parsed}</span>
                                        </DefinitionItem>
                                    )}
                                </dl>
                            </div>

                            <BlockchainSteps {...getBlockchainStepsProps()} />
                        </>
                    )}
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
                <MutedText>You will automatically lose ${currentMarket.ticker} tokens after settlement.</MutedText>
            </SheetFooter>
        </>
    );
};

export default function CancelOfferModal({ offerDetails, className }) {
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    return (
        <Sheet open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className={className}>
                    Cancel
                    <ArrowIcon className="ml-2 size-2" />
                </Button>
            </SheetTrigger>
            <SheetContent className="h-full flex flex-col rounded-t-lg">
                <Content
                    offerDetails={offerDetails}
                    isCancelModalOpen={isCancelModalOpen}
                    setIsCancelModalOpen={setIsCancelModalOpen}
                />
            </SheetContent>
        </Sheet>
    );
}
