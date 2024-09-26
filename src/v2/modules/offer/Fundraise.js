import { cn } from "@/lib/cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/v2/components/ui/tooltip";
import { useOfferDetailsQuery, useUserAllocationQuery } from "@/v2/modules/offer/queries";
import { useOfferProgressQuery, useOfferStatus } from "@/v2/modules/opportunities/useSingleOfferLogic";
import { OfferStatus } from "@/v2/modules/opportunities/helpers";
import { Progress } from "@/v2/components/ui/progress";
import { formatCurrency, formatPercentage } from "@/v2/helpers/formatters";
import { Skeleton } from "@/v2/components/ui/skeleton";

const TBA_TEXT = "TBA";

const Definition = ({ term, isLoading, children }) => (
    <>
        <dt>{term}:</dt>
        <dd className="text-right justify-self-end font-medium">
            {isLoading ? <Skeleton className="w-8" /> : children}
        </dd>
    </>
);

const getCurrency = (value) => (value > 0 ? formatCurrency(value) : null);

const getTGE = (tge, ppu) =>
    tge > 0 && ppu ? `(${formatPercentage((tge - ppu) / ppu)}) ${formatCurrency(tge)}` : null;

export default function Fundraise({ className }) {
    const userAllocation = useUserAllocationQuery();
    const { data: offer, isLoading } = useOfferDetailsQuery();
    const { status } = useOfferStatus(offer);

    const { data: { progress = 0, filled = 0 } = {} } = useOfferProgressQuery(offer.id, {
        refetchInterval: status === OfferStatus.IN_PROGRESS ? 15000 : false,
    });

    const progressValue = status === OfferStatus.CLOSED ? 100 : progress;

    const { data: { invested: { booked = 0, invested = 0 } = {} } = {} } = userAllocation;

    return (
        <div className={cn("p-6 rounded bg-white/[.07] backdrop-blur-3xl space-y-6", className)}>
            <div className="flex gap-2 items-center">
                <h2 className="text-xl md:text-2xl font-medium select-none">Fundraise Goal</h2>
                <Tooltip>
                    <TooltipTrigger
                        className="size-4 rounded-full bg-white/[.14] text-2xs flex items-center justify-center cursor-help hover:bg-white/[.2] transition-colors duration-200"
                        asChild
                    >
                        <span>?</span>
                    </TooltipTrigger>
                    <TooltipContent>Something to show</TooltipContent>
                </Tooltip>
            </div>
            <div>
                <div className="flex justify-between items-end mb-4 select-none">
                    <p className="text-xl md:text-3xl">{formatCurrency(filled)}</p>
                    <p className="text-base md:text-lg text-success">{formatPercentage(progressValue / 100)} Filled</p>
                </div>
                <Progress value={progressValue} variant="success" />
            </div>
            <div>
                <dl className="grid grid-cols-2 gap-2 md:gap-3 text-sm md:text-base select-none">
                    {booked > 0 && (
                        <Definition term="Reserved" isLoading={isLoading}>
                            {getCurrency(booked) ?? TBA_TEXT}
                        </Definition>
                    )}
                    {invested > 0 && (
                        <Definition term="My investment" isLoading={isLoading}>
                            {getCurrency(invested) ?? TBA_TEXT}
                        </Definition>
                    )}
                    <Definition term="Ticker" isLoading={isLoading}>
                        ${offer.ticker}
                    </Definition>
                    <Definition term="Price" isLoading={isLoading}>
                        {getCurrency(offer.ppu) ?? TBA_TEXT}
                    </Definition>
                    {offer.tge && (
                        <Definition term="TGE" isLoading={isLoading}>
                            {getTGE(offer.tge, offer.ppu) ?? TBA_TEXT}
                        </Definition>
                    )}
                    <Definition term="Cliff" isLoading={isLoading}>
                        {offer.t_cliff ?? TBA_TEXT}
                    </Definition>
                    <Definition term="Vesting" isLoading={isLoading}>
                        {offer.t_vesting ?? TBA_TEXT}
                    </Definition>
                </dl>
            </div>
        </div>
    );
}
