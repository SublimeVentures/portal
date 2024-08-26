import { Avatar } from "@/v2/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/v2/components/ui/skeleton";
import { Card, CardTitle } from "@/v2/components/ui/card";
import AlertDestructive from "@/v2/components/Alert/DestructiveAlert";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import useInvestmentsData from "@/v2/hooks/useInvestmentsData";
import { cn } from "@/lib/cn";
import { Attributes } from "@/v2/components/App/Vault/InvestmentRow";
import { Button } from "@/v2/components/ui/button";
import Modal from "@/v2/components/App/Vault/ClaimModal";

// aspect-[5/8]
const InvestmentCardWrapper = ({ children, className }) => {
    return (
        <Card
            className={cn(
                "relative flex flex-col py-5 px-4 md:py-8 md:px-5 h-full w-full hover:scale-[1.02] group/button",
                className,
            )}
        >
            {children}
        </Card>
    );
};

export const SkeletonInvestmentCard = () => {
    return (
        <InvestmentCardWrapper>
            <div className="mb-8 flex items-center gap-8">
                <div className="w-full flex flex-col gap-2">
                    <Skeleton className="w-3/4" />
                    <Skeleton className="w-full" />
                </div>
                <SkeletonCircle className="size-16" />
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4">
                <Skeleton count={4} className="w-full" />
                <Skeleton count={4} className="w-full" />
            </div>

            <Skeleton className="mt-auto h-8 w-full" />
        </InvestmentCardWrapper>
    );
};

export const ErrorInvestmentCard = ({ actionFn }) => {
    return (
        <InvestmentCardWrapper>
            <AlertDestructive variant="column" actionFn={actionFn} />
        </InvestmentCardWrapper>
    );
};

const InvestmentCard = ({ details, isLoading = false, isError = false }) => {
    const data = useInvestmentsData(details);
    const { title, coin, logo, participatedDate, canClaim, isClaimSoon } = data;

    if (isLoading) {
        return <SkeletonInvestmentCard />;
    }

    if (isError) {
        return <ErrorInvestmentCard actionFn={() => {}} />;
    }
    return (
        <InvestmentCardWrapper>
            <div className="mb-4 md:mb-8 flex justify-between items-center">
                <div>
                    <CardTitle className="text-sm font-semibold md:text-lg md:font-medium text-foreground leading-none">
                        {coin}
                    </CardTitle>
                    <p className="text-xs font-light md:text-base text-foreground leading-none">{title}</p>
                </div>
                <Avatar
                    className="size-10"
                    session={{
                        img: logo,
                    }}
                />
            </div>
            <Attributes details={data} className="grow gap-2 mb-5" grid />
            <Modal data={data}>
                <Button variant={canClaim ? "accent" : "outline"} className="mb-3.5 mt-auto w-full font-xs">
                    <span>{canClaim || isClaimSoon ? (canClaim ? "Claim" : "Unlock soon") : "Details"}</span>
                    <ArrowIcon className="ml-2 size-2" />
                </Button>
            </Modal>

            {participatedDate && (
                <p className="absolute left-0 bottom-1 py-2 w-full text-xxs font-light text-foreground/[.56] text-center">
                    Participated {participatedDate}
                </p>
            )}
        </InvestmentCardWrapper>
    );
};

export default InvestmentCard;
