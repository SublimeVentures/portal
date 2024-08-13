import Image from "next/image";
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
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import { METHOD } from "@/components/BlockchainSteps/utils";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { formatCurrency, formatPercentage } from "@/v2/helpers/formatters";
import { cn } from "@/lib/cn";

const Title = ({ children }) => (
    <h3 className="text-xs md:text-base font-medium text-white px-8 mb-3 md:mb-1">{children}</h3>
);

const PercentWrapper = ({ value }) => (
    <span
        className={cn({
            "text-green-400": Number(value) > 0,
            "text-red-500": Number(value) < 0,
        })}
    >
        {Number(value) == 0 ? "TBA" : formatPercentage(value / 100, true)}
    </span>
);

export default function ClaimModal({ className, children, data }) {
    const { account, activeInvestContract } = useEnvironmentContext();
    const { resetState, getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({
        data: {
            steps: {
                network: true,
                transaction: true,
            },
            params: {
                requiredNetwork: data.currentPayout?.chainId,
                account: account.address,
                amount: Number(data.currentPayout?.amount),
                offerId: data.currentPayout?.offerId,
                payoutId: data.currentPayout?.id,
                claimId: data.currentPayout?.claims[0]?.id,
                contract: activeInvestContract,
                buttonText: "Claim",
                prerequisiteTextWaiting: "Sign transaction",
                prerequisiteTextProcessing: "Getting signature",
                prerequisiteTextSuccess: "Hash obtained",
                prerequisiteTextError: "Invalid transaction data",
                transactionType: METHOD.CLAIM,
            },
            token: data.coin,
            setTransactionSuccessful: () => {},
        },
    });
    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <Image
                        src={data.logo}
                        className="size-20 md:size-30 rounded-full mb-2"
                        alt={data.title}
                        width={100}
                        height={100}
                    />
                    <SheetTitle>{data.title}</SheetTitle>
                    <SheetDescription>{data.coin}</SheetDescription>
                </SheetHeader>
                <SheetBody className="px-4 md:px-30 py-3 md:py-0 flex flex-col gap-3 md:gap-4 mt-4">
                    <div>
                        <Title>Status</Title>
                        <div className="definition-section my-0">
                            <dl className="definition-grid">
                                <DefinitionItem term="Progress">{formatPercentage(data.progress / 100)}</DefinitionItem>
                                <DefinitionItem term="Invested">{formatCurrency(data.invested)}</DefinitionItem>
                                <DefinitionItem term="Vested">{formatCurrency(data.vested)}</DefinitionItem>
                            </dl>
                        </div>
                    </div>
                    <div>
                        <Title>Performance</Title>
                        <div className="definition-section my-0">
                            <dl className="definition-grid">
                                {data.isManaged ? (
                                    <>
                                        <DefinitionItem term="TGE gain">
                                            <PercentWrapper value={data.tgeGain} />
                                        </DefinitionItem>
                                        <DefinitionItem term="Return">
                                            <PercentWrapper value={data.performance} />
                                        </DefinitionItem>
                                    </>
                                ) : (
                                    <DefinitionItem term="ATH">{formatCurrency(data.ath)}</DefinitionItem>
                                )}
                            </dl>
                        </div>
                    </div>
                    <div>
                        <Title>Dates</Title>
                        <div className="definition-section my-0">
                            <dl className="definition-grid">
                                <DefinitionItem term="Participated">{data.participatedDate}</DefinitionItem>
                                {data.currentPayout ? (
                                    <>
                                        <DefinitionItem term="Current unlock">
                                            {data.currentPayout.unlockDate}
                                        </DefinitionItem>
                                        <DefinitionItem term="Allocation Snapshot">
                                            {data.currentPayout.snapshotDate}
                                        </DefinitionItem>
                                        <DefinitionItem term="Claim date">
                                            {data.currentPayout.claimDate}
                                        </DefinitionItem>
                                    </>
                                ) : (
                                    <>
                                        <DefinitionItem term="Current unlock">
                                            {data.nextPayout.unlockDate || "TBA"}
                                        </DefinitionItem>
                                        <DefinitionItem term="Allocation Snapshot">
                                            {data.nextPayout.snapshotDate || "TBA"}
                                        </DefinitionItem>
                                        <DefinitionItem term="Claim date">
                                            {data.nextPayout.claimDate || "TBA"}
                                        </DefinitionItem>
                                    </>
                                )}
                            </dl>
                        </div>
                    </div>
                    <BlockchainSteps {...getBlockchainStepsProps()} />
                </SheetBody>
                {data.canClaim && (
                    <SheetFooter>
                        <Button variant="accent" onClick={() => {}}>
                            Claim
                        </Button>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
