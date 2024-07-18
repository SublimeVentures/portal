import { Avatar } from "@/v2/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/v2/components/ui/skeleton";
import { Card, CardTitle } from "@/v2/components/ui/card";
import AlertDestructive from "@/v2/components/Alert/DestructiveAlert";
import { cn } from "@/lib/cn";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import useInvestmentsData from "@/v2/hooks/useInvestmentsData";
import { formatCurrency, formatPercentage } from "@/v2/helpers/formatters";
import { Button } from "@/v2/components/ui/button";

const InvestmentRowWrapper = ({ children, className }) => {
    return <Card className={cn("h-max py-5 px-8 hover:scale-[1.02] group/button", className)}>{children}</Card>;
};

export const SkeletonInvestmentRow = () => {
    return (
        <InvestmentRowWrapper className="flex items-center justify-between">
            <div className="grid grid-cols-8 items-center gap-x-16">
                <SkeletonCircle className="h-[55px] w-[55px]" />
                {Array.from({ length: 4 }, (_, index) => (
                    <div key={index}>
                        <Skeleton className="w-3/4 h-4 my-2" />
                        <Skeleton className="w-full h-3" />
                    </div>
                ))}
                <Skeleton className="w-full" />
                <Skeleton className="w-full" />
                <Skeleton className="w-full" />
            </div>
        </InvestmentRowWrapper>
    );
};

export const ErrorInvestmentRow = ({ actionFn }) => {
    return (
        <InvestmentRowWrapper>
            <AlertDestructive actionFn={actionFn} />
        </InvestmentRowWrapper>
    );
};

const Definition = ({ title, children, disabled = false }) => {
    const disabledClassName = {
        "text-foreground/[.4]": disabled,
        "text-foreground": !disabled,
    };
    return (
        <div
            className={cn(
                "group-[.dg]:grid group-[.dg]:col-span-2 group-[.dg]:grid-cols-2 md:group-[.dl]:flex md:group-[.dl]:flex-col-reverse",
                disabledClassName,
            )}
        >
            <div className={cn("text-xs md:text-md font-light")}>{title}</div>
            <div className={cn("text-xs md:text-lg font-medium group-[.dg]:text-right")}>{children}</div>
        </div>
    );
};

const DefinitionList = ({ children, className, grid = false }) => (
    <div
        className={cn(
            "grid",
            { "grid-cols-2 md:grid-rows-1 group dl": !grid, "grid-cols-2 group dg": grid },
            className,
        )}
    >
        {children}
    </div>
);

export const Attributes = ({ details, className, grid }) => {
    return (
        <DefinitionList className={className} grid={grid}>
            <Definition title="Invested">{formatCurrency(details.invested)}</Definition>
            <Definition title="Vested">{formatPercentage(details.vested / 100)}</Definition>
            {details.isManaged ? (
                <Definition title="Performance">
                    {performance === 0 ? "TBA" : formatPercentage(details.performance / 100, true)}
                </Definition>
            ) : (
                <Definition title="ATH Profit">{details.ath === 0 ? "TBA" : formatCurrency(details.ath)}</Definition>
            )}
            <Definition title="Next Unlock">
                {details.canClaim ? "Available" : details.isClaimSoon ? "Soon" : "TBA"}
            </Definition>
        </DefinitionList>
    );
};

const InvestmentRow = ({ details, isLoading = false, isError = false }) => {
    const data = useInvestmentsData(details);
    const { title, coin, logo, participatedDate, canClaim, isClaimSoon } = data;

    if (isLoading) {
        return <SkeletonInvestmentRow />;
    }

    if (isError) {
        return <ErrorInvestmentRow actionFn={() => {}} />;
    }

    return (
        <InvestmentRowWrapper>
            <div className="grid grid-cols-8 items-center">
                <Avatar session={{ img: logo }} />

                <div>
                    <CardTitle className="mb-1 text-2xl font-medium text-foreground leading-none">{coin}</CardTitle>
                    <p className="text-md font-light text-foreground">{title}</p>
                </div>

                <Attributes details={data} className="grid-cols-4 col-span-4" />

                <p className="text-xxs font-light text-foreground/[.56]">
                    {participatedDate && `Participated ${participatedDate}`}
                </p>

                <Button variant={canClaim ? "accent" : "outline"}>
                    <span>{canClaim || isClaimSoon ? (canClaim ? "Claim" : "Unlock soon") : "Details"}</span>
                    <ArrowIcon className="ml-2 size-2" />
                </Button>
            </div>
        </InvestmentRowWrapper>
    );
};

export default InvestmentRow;
