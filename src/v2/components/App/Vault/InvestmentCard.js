import Image from "next/image";
import { useCallback, useState } from "react";
import { Skeleton, SkeletonCircle } from "@/v2/components/ui/skeleton";
import { Card, CardTitle } from "@/v2/components/ui/card";
import AlertDestructive from "@/v2/components/Alert/DestructiveAlert";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import useInvestmentsData from "@/v2/hooks/useInvestmentsData";
import { cn } from "@/lib/cn";
import { Attributes } from "@/v2/components/App/Vault/InvestmentRow";
import { Button } from "@/v2/components/ui/button";
import ClaimModal from "@/v2/components/App/Vault/ClaimModal";
import useImage from "@/v2/hooks/useImage";
import MutedText from "@/v2/components/ui/muted-text";
import ReassignModal from "@/v2/components/App/Vault/ReassignModal";
import { awaitForReassign } from "@/fetchers/vault.fetcher";

// aspect-[5/8]
const InvestmentCardWrapper = ({ children, className }) => {
    return (
        <Card
            className={cn(
                "relative flex flex-col py-5 px-4 md:py-8 md:px-5 h-full w-full hover:scale-[1.02] group/button lg:max-w-200 3xl:max-w-[300px] cursor-default",
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

const InvestmentCard = ({ details, isLoading = false, isError = false, refetch }) => {
    const data = useInvestmentsData(details, refetch);
    const { title, coin, slug, participatedDate, canClaim, isClaimSoon } = data;
    const { getResearchIconSrc } = useImage();
    const [reassignProcess, setReassignProcess] = useState(false);
    const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);

    const closeReassignModal = useCallback(
        async (isTransactionSuccessful) => {
            setIsReassignModalOpen(false);
            if (isTransactionSuccessful) {
                setReassignProcess(true);
                const data = await awaitForReassign(details.id);

                if (data.ok) {
                    refetch();
                }
                setReassignProcess(false);
            }
        },
        [details, refetch],
    );

    const openReassignModal = useCallback(() => setIsReassignModalOpen(true), []);

    if (isLoading) {
        return <SkeletonInvestmentCard />;
    }

    if (isError) {
        return <ErrorInvestmentCard actionFn={() => {}} />;
    }
    return (
        <InvestmentCardWrapper>
            <div className="mb-4 md:mb-8 flex justify-between items-center">
                <div className="select-none">
                    <CardTitle className="text-sm font-semibold md:text-lg md:font-medium text-white leading-none">
                        {coin}
                    </CardTitle>
                    <p className="text-xs font-light md:text-base text-white leading-none">{title}</p>
                </div>
                <Image
                    src={getResearchIconSrc(slug)}
                    alt={coin}
                    width={40}
                    height={40}
                    className="overflow-hidden rounded-full size-10 pointer-events-none select-none bg-primary-800"
                />
            </div>
            {reassignProcess && (
                <div className="absolute left-0 top-0 w-full h-full backdrop-blur flex-center z-10">
                    <p className="text-xs font-light md:text-base bg:text-green-500 text-white animate-pulse leading-none">
                        Reassigning Vault
                    </p>
                </div>
            )}
            <Attributes details={data} className="grow gap-2 mb-5 select-none" grid />
            <ClaimModal openReassignModal={openReassignModal} data={data}>
                <Button variant={canClaim ? "accent" : "outline"} className="mb-3.5 mt-auto w-full font-xs">
                    <span>{canClaim || isClaimSoon ? (canClaim ? "Claim" : "Unlock soon") : "Details"}</span>
                    <ArrowIcon className="ml-2 size-2" />
                </Button>
            </ClaimModal>
            <ReassignModal
                data={data}
                isReassignModalOpen={isReassignModalOpen}
                closeReassignModal={closeReassignModal}
            />
            {participatedDate && (
                <MutedText className="absolute left-0 bottom-1 py-2 w-full md:text-xs">
                    Participated {participatedDate}
                </MutedText>
            )}
        </InvestmentCardWrapper>
    );
};

export default InvestmentCard;
