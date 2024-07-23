import { useState, useEffect } from "react";
import Link from "next/link";

import { Sheet, SheetClose, SheetTrigger, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetBody, SheetTitle } from "@/v2/components/ui/sheet";
import { Button } from "@/v2/components/ui/button";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import BlockchainSteps from "@/v2/components/BlockchainSteps"
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import useCreateOfferModalLogic from "./useCreateOfferModalLogic";
import { ExternalLinks } from "@/routes";
import MakeTransactionSuccess from "./MakeTransactionSuccess";
import SelectedMarket from "./SelectedMarket";
import OfferTabs from "./OfferTabs";
import OfferForm from "./OfferForm";

export default function MakeOfferModal({ session }) {
    const [isMakeModalOpen, setIsMakeModalOpen] = useState(false);

    const {
        transactionSuccessful,
        textCopy,
        currentMarket,
        blockchainInteractionData,
        getSelectedMarketProps,
        getOfferTabsProps,
        getOfferFormProps,
    } = useCreateOfferModalLogic(isMakeModalOpen, setIsMakeModalOpen);

    const { resetState, getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({ data: blockchainInteractionData })

    useEffect(() => {
        if (!isMakeModalOpen) resetState();
    }, [isMakeModalOpen])

    return (
        <Sheet open={isMakeModalOpen} onOpenChange={setIsMakeModalOpen}>
            <SheetTrigger asChild>
                <Button>Create offer</Button>
            </SheetTrigger>

            <SheetContent className="h-full flex flex-col rounded-t-lg">
                <SheetHeader>
                    <SheetTitle>{transactionSuccessful ? "Offer created" : "Create Offer"}</SheetTitle>
                    <SheetDescription>OTC Marketplace</SheetDescription>
                </SheetHeader>
                
                <SheetBody>
                    <div className="h-full my-4 mr-4 block-scrollbar overflow-y-auto">
                        {transactionSuccessful 
                            ? <MakeTransactionSuccess market={currentMarket.name} textCopy={textCopy} amount={amount} /> 
                            : (
                                <div className="mx-4 sm:px-10">
                                    <div className="mb-2 py-4 px-2 flex flex-col gap-4 bg-foreground/[.02] rounded">
                                        <SelectedMarket {...getSelectedMarketProps()} />
                                        <OfferTabs {...getOfferTabsProps()} />
                                        <OfferForm {...getOfferFormProps()} />
                                    </div>

                                    <BlockchainSteps {...getBlockchainStepsProps()} />
                                </div>
                            )
                        }
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
                    
                    <p className="text-xxs text-foreground/[.5]">
                        <Link href={ExternalLinks.OTC} target="_blank" rel="noopener noreferrer" className="underline">Read more</Link>
                        {" "}before making an offer.
                    </p>
                </SheetFooter> 
            </SheetContent>
        </Sheet>
    );
}
