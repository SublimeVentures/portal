import { useState, useMemo } from "react";
// eslint-disable-next-line import/namespace
import * as chains from "wagmi/chains";
import useCreateOfferModalLogic from "./useCreateOfferModalLogic";
import MakeTransactionSuccess from "./MakeTransactionSuccess";
import SelectedMarket from "./SelectedMarket";
import OfferTabs from "./OfferTabs";
import OfferForm from "./OfferForm";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import {
    Sheet,
    SheetClose,
    SheetTrigger,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetBody,
    SheetTitle,
} from "@/v2/components/ui/sheet";
import { Button } from "@/v2/components/ui/button";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import MutedText from "@/v2/components/ui/muted-text";

// import Test from "@/v2/modules/offer/Invest/Modals/InvestModal/Test"
const MakeOfferModalContent = ({ content, blockchainStep }) => {
    const { network } = useEnvironmentContext();
    const { chainId } = network;
    const chain = useMemo(() => Object.values(chains).find(({ id }) => id === chainId), [chainId]);
    const {
        transactionSuccessful,
        textCopy,
        amount,
        currentMarket,
        getSelectedMarketProps,
        getOfferTabsProps,
        getOfferFormProps,
    } = content;
    const { getBlockchainStepButtonProps, getBlockchainStepsProps } = blockchainStep;
    const offerFormProps = getOfferFormProps();
    const offerTabsProps = getOfferTabsProps();
    const currency = offerFormProps.getOfferFieldProps("currency");
    return (
        <SheetContent className="h-full flex flex-col rounded-t-lg">
            <SheetHeader>
                <SheetTitle>{transactionSuccessful ? "Offer created" : "Create Offer"}</SheetTitle>
                <SheetDescription>OTC Marketplace</SheetDescription>
            </SheetHeader>

            <SheetBody>
                <div className="block-scrollbar sm:overflow-y-auto">
                    {transactionSuccessful ? (
                        <MakeTransactionSuccess market={currentMarket.name} textCopy={textCopy} amount={amount} />
                    ) : (
                        <div className="h-full my-4 sm:mr-4">
                            <div className="mx-4 sm:px-10">
                                <div className="mb-2 py-4 px-2 flex flex-col gap-4 bg-white/[.02] rounded">
                                    <SelectedMarket {...getSelectedMarketProps()} />
                                    <OfferTabs {...offerTabsProps} />
                                    <OfferForm {...offerFormProps} />
                                </div>

                                <BlockchainSteps {...getBlockchainStepsProps()} />
                            </div>
                        </div>
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
                {offerTabsProps.selectedTab === 0 && (
                    <MutedText>
                        Note: You will be buying the allocation using ${currency.value} on {chain?.name}.
                    </MutedText>
                )}
                {offerTabsProps.selectedTab === 1 && (
                    <MutedText>
                        Note: You will be selling your allocation for ${currency.value} on {chain?.name}.
                    </MutedText>
                )}
            </SheetFooter>
        </SheetContent>
    );
};

export default function MakeOfferModal() {
    const [isMakeModalOpen, setIsMakeModalOpen] = useState(false);

    const { selectedTab, blockchainInteractionDataSELL, blockchainInteractionDataBUY, ...content } =
        useCreateOfferModalLogic(isMakeModalOpen, setIsMakeModalOpen);

    const { ...buyBlockchainStep } = useBlockchainStep({
        data: blockchainInteractionDataSELL,
        deps: [selectedTab, isMakeModalOpen],
    });

    const { ...sellBlockchainStep } = useBlockchainStep({
        data: blockchainInteractionDataBUY,
        deps: [selectedTab, isMakeModalOpen],
    });

    return (
        <Sheet open={isMakeModalOpen} onOpenChange={setIsMakeModalOpen}>
            <SheetTrigger asChild>
                <Button>Create Offer</Button>
            </SheetTrigger>
            <MakeOfferModalContent
                content={content}
                blockchainStep={selectedTab === 1 ? buyBlockchainStep : sellBlockchainStep}
            />
        </Sheet>
    );
}
