import Image from "next/image";
import { ChevronRightIcon } from "@radix-ui/react-icons";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { cn } from "@/lib/cn";
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
} from "@/v2/components/ui/sheet";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import BlockchainSteps from "@/v2/components/BlockchainSteps"
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import useBlockchainTakeOfferTransaction from "./useBlockchainTakeOfferTransaction";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import TransactionSuccess from "../TransactionSucces";

const mockedIcon = `https://cdn.basedvc.fund/research/blockgames/icon.jpg`

export default function TakeOfferModal(props) {
    const { offerDetails, vault, currentMarket, refetchVault, refetchOffers, className } = props;
    const { getCurrencySymbolByAddress, network, otcFee, cdn } = useEnvironmentContext();

    const { totalPayment, transactionSuccessful, blockchainInteractionData, setTransactionSuccessful } = useBlockchainTakeOfferTransaction({ offerDetails, vault, currentMarket });
    const { resetState, getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({ data: blockchainInteractionData })

    if (!currentMarket?.name || !offerDetails?.currency) return;

    const chainDesired = network.chains?.find((el) => el.id === offerDetails?.chainId);
    const cancelOfferAmount_parsed = offerDetails?.amount?.toLocaleString();
    const cancelOfferPrice_parsed = offerDetails?.price?.toLocaleString();

    const handleModalClose = async () => {
        if (transactionSuccessful) await Promise.all([refetchVault(), refetchOffers()]).finally(() => setTransactionSuccessful(false));
        else setTransactionSuccessful(false);

        resetState();
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="accent" className={className}>
                    Take
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
                    <SheetTitle>{currentMarket.name}</SheetTitle>
                    <SheetDescription>{currentMarket.genre}</SheetDescription>
                </SheetHeader>

                <SheetBody>
                    <div className="mx-10 my-4 sm:px-10">
                        <div className="definition-section">
                            {transactionSuccessful ? (
                                <TransactionSuccess title="OTC Offer filled" description="You have successfully filled OTC offer." />
                            ) : (
                                <>
                                    <h3 className="text-2xl font-medium text-foreground text-center">Take OTC Offer</h3>
                                    <p className="mb-2 text-md text-foreground text-center">
                                        {offerDetails.isSell
                                            ? "Are you sure you want to buy allocation from this SELL offer?"
                                            : "Are you sure you want to sell your allocation to this BUY offer?"
                                        }
                                    </p>
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
                                        <DefinitionItem term="Fees">${otcFee}</DefinitionItem>
                                    </dl>
                                </>
                            )}
                        </div>
                        
                        <BlockchainSteps {...getBlockchainStepsProps()} />

                        <div>
                            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Overview</h3>
                            <div className='py-4 px-8 flex justify-between items-center bg-foreground/[.1]'>
                                <div className="flex items-center">
                                    {/* <DynamicIcon name={getCurrencySymbolByAddress(offerDetails.currency)} style={"w-6"} /> */}
                                    <Image src={mockedIcon} className="inline mx-2 rounded-full" alt="Cover image of ${name} token" width={35} height={35} />
                                    <dl className="flex flex-col gap-2">
                                        <DefinitionItem term="You Pay">${totalPayment}</DefinitionItem>
                                    </dl>
                                </div>
                                <ChevronRightIcon className="text-foreground"/>
                                <div className="flex items-center">
                                    <Image src={`${cdn}/research/${currentMarket.slug}/icon.jpg`} className="inline mx-2 rounded-full" alt="Cover image of ${name} token" width={35} height={35} />
                                    <dl className="flex flex-col gap-2">
                                        <DefinitionItem DefinitionItem term="You Recieve">?</DefinitionItem>
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
                    <p className="text-xxs text-foreground/[.5]">You will automatically receive ${currentMarket.ticker} tokens after settlement.</p>
                </SheetFooter> 
            </SheetContent>
        </Sheet>
    );
};
