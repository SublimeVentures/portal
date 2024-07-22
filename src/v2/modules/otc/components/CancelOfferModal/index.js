import Image from "next/image";

import { cn } from "@/lib/cn";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Button } from "@/v2/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetBody,
  SheetTitle,
  SheetTrigger,
} from "@/v2/components/ui/sheet";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import TransactionSuccess from "../TransactionSucces";
import useBlockchainCancelOfferTransaction from "./useBlockchainCancelOfferTransaction";
import useMarket from "../../logic/useMarket";

const mockedIcon = `https://cdn.basedvc.fund/research/blockgames/icon.jpg`

// @TODO - fetch vault 
// const { currentMarket, offerDetails, refetchVault, refetchOffers, className } = props;
export default function CancelOfferModal({ session, offerDetails, className }) {
    const { currentMarket } = useMarket();
    const { getCurrencySymbolByAddress, network, cdn } = useEnvironmentContext();

    const { blockchainInteractionData, transactionSuccessful, setTransactionSuccessful } = useBlockchainCancelOfferTransaction({ otcId: currentMarket?.otc, dealId: offerDetails?.dealId, requiredNetwork: offerDetails?.chainId });
    const { resetState, getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({ data: blockchainInteractionData })

    const cancelOfferAmount_parsed = offerDetails?.amount?.toLocaleString();
    const cancelOfferPrice_parsed = offerDetails?.price?.toLocaleString();
    const chainDesired = network?.chains?.find((el) => el.id === offerDetails?.chainId);

    const handleModalClose = async () => {
        if (transactionSuccessful) await Promise.all([refetchVault(), refetchOffers()]).finally(() => setTransactionSuccessful(false));
        else setTransactionSuccessful(false);
        resetState();
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className={className}>
                    Cancel
                    <ArrowIcon className="ml-2" />
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
                    <SheetTitle>{transactionSuccessful ? "OTC offer cancelled" : "Cancel OTC offer"}</SheetTitle>
                </SheetHeader>

                <SheetBody>
                    <div className="mx-10 my-4 sm:px-10">
                        {transactionSuccessful ? (
                            <TransactionSuccess title="OTC Offer cancelled" description="You have successfully cancelled OTC offer." />
                        ) : (
                            <>
                                <div className="definition-section">
                                    <h3 className="text-2xl font-medium text-foreground text-center">Cancel OTC Offer</h3>
                                    <p className="mb-2 text-md text-foreground text-center">Are you sure you want to cancel this offer?</p>
                                    <dl className="definition-grid">
                                        <DefinitionItem term="Market">{currentMarket.name}</DefinitionItem>
                                        <DefinitionItem term="Type" className={cn({ "text-red-500": offerDetails.isSell, "text-green-500": !offerDetails.isSell })}>
                                            {offerDetails.isSell ? "Sell" : "Buy"}
                                        </DefinitionItem>
                                        <DefinitionItem term="Blockchain">
                                            {/* <DynamicIcon name={NETWORKS[chainDesired?.id]} style={ButtonIconSize.hero4} /> */}
                                            <Image src={mockedIcon} className="inline mx-2 rounded-full" alt="Cover image of selected blockchain" width={20} height={20} />
                                            <span>{chainDesired?.name}</span>
                                        </DefinitionItem>
                                        <DefinitionItem term="Amount">${cancelOfferAmount_parsed}</DefinitionItem>
                                        <DefinitionItem term="Price">${cancelOfferPrice_parsed}</DefinitionItem>
                                        {!offerDetails?.isSell && (
                                            <DefinitionItem term="Funds returned">
                                                {/* <DynamicIcon name={fferDetails?.currency)} style={ButtonIconSize.hero4} /> */}
                                                <Image src={mockedIcon} className="inline mx-2 rounded-full" alt="Cover image of selected blockchain" width={20} height={20} />
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
    
                    <p className="text-xxs text-foreground/[.5]">You will automatically lose ${currentMarket.ticker} tokens after settlement.</p>
                </SheetFooter> 
            </SheetContent>
        </Sheet>
    );
}
