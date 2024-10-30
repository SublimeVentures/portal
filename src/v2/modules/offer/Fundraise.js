import { cn } from "@/lib/cn";
import { OfferStatus } from "@/v2/modules/opportunities/helpers";
import { useOfferProgressQuery, useOfferStatus } from "@/v2/modules/opportunities/useSingleOfferLogic";
import { useOfferDetailsQuery, useUserAllocationQuery, useOfferAllocationQuery } from "@/v2/modules/offer/queries";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/v2/components/ui/tooltip";
import { Progress } from "@/v2/components/ui/progress";
import { Skeleton } from "@/v2/components/ui/skeleton";
import { formatCurrency, formatPercentage } from "@/v2/helpers/formatters";

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

export const QuestionMark = ({ className }) => (
    <span
        className={cn(
            "size-4 rounded-full bg-white/15 text-2xs flex items-center justify-center cursor-help hover:bg-white/20 transition-colors duration-200",
            className,
        )}
    >
        ?
    </span>
);

export default function Fundraise({ className }) {
    const userAllocation = useUserAllocationQuery({
        refetchInterval: (query) => {
            return query.state.data?.invested?.booked > 0 ? 10000 : false;
        },
    });
    const { data: offer, isLoading } = useOfferDetailsQuery();
    const { data: offerAllocation } = useOfferAllocationQuery();
    const { status } = useOfferStatus(offer);
    const reserved = status === OfferStatus.CLOSED ? 0 : offerAllocation?.reserved;

    const progressValue = status === OfferStatus.CLOSED ? 100 : offerAllocation?.progress ?? 0;
    const { data: { invested: { booked = 0, invested = 0 } = {} } = {} } = userAllocation;
    const sum = progressValue + reserved;

    return (
        <div className={cn("p-6 rounded bg-alt space-y-6 border-alt", className)}>
            <div className="flex gap-2 items-center">
                <h2 className="text-xl md:text-2xl font-medium select-none font-heading">Fundraise Goal</h2>
                {/* <Tooltip>
                    <TooltipTrigger
                        asChild
                    >
                        <QuestionMark />
                    </TooltipTrigger>
                    <TooltipContent>Something to show</TooltipContent>
                </Tooltip> */}
            </div>
            <div>
                <div className="flex justify-between items-end mb-4 select-none">
                    <p className="text-xl md:text-3xl">{formatCurrency(offerAllocation?.alloTotal ?? 0)}</p>
                    <p className="text-base md:text-lg text-success">{formatPercentage(sum / 100)}</p>
                </div>
                <Progress value={[progressValue, progressValue + reserved]} variant="success" />
                {status !== OfferStatus.CLOSED && (
                    <>
                        <p className="text-xs md:text-sm text-success mt-2 text-right">
                            {formatPercentage(progressValue / 100)} Filled
                        </p>
                        {offerAllocation?.reserved > 0 && (
                            <p className="text-xs md:text-sm text-success/50 mt-2 text-right">
                                {formatPercentage(offerAllocation?.reserved / 100)} Booked
                            </p>
                        )}
                    </>
                )}
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
