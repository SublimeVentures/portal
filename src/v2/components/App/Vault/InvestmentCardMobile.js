import { useRef, useEffect } from "react";
import VanillaTilt from "vanilla-tilt";

import { Avatar } from "@/v2/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/v2/components/ui/skeleton";
import { Card, CardButton } from "@/v2/components/ui/card";
import AlertDestructive from "@/v2/components/Alert/DestructiveAlert";
import { cn } from "@/lib/cn";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import useInvestmentsData from "@/v2/hooks/useInvestmentsData";
import Modal from "@/v2/components/App/Vault/ClaimModal";
import { Attributes } from "@/v2/components/App/Vault/InvestmentRow";
import { Button } from "@/v2/components/ui/button";

const InvestmentCardMobileWrapper = ({ children, className }) => {
    const tilt = useRef(null);
    useEffect(() => VanillaTilt.init(tilt.current, { scale: 1.02, speed: 1000, max: 2 }), []);

    return (
        <Card ref={tilt} className={cn("h-max p-2", className)}>
            {children}
        </Card>
    );
};

export const SkeletonInvestmentCardMobile = () => {
    return (
        <InvestmentCardMobileWrapper>
            <div className="px-6 py-4 grid grid-cols-3 gap-4">
                <SkeletonCircle className="h-[55px] w-[55px]" />
                {Array.from({ length: 5 }, (_, index) => (
                    <div key={index}>
                        <Skeleton count={2} className="my-1" />
                    </div>
                ))}
            </div>

            <div className="mx-5">
                <Skeleton className="h-8" />
            </div>
        </InvestmentCardMobileWrapper>
    );
};
export const ErrorInvestmentCardMobile = ({ actionFn }) => {
    return (
        <InvestmentCardMobileWrapper>
            <AlertDestructive variant="column" actionFn={actionFn} />
        </InvestmentCardMobileWrapper>
    );
};

const InvestmentCardMobile = ({ details, isLoading = false, isError = false }) => {
    const data = useInvestmentsData(details);
    const { title, coin, logo, participatedDate, canClaim, isClaimSoon } = data;

    if (isLoading) {
        return <SkeletonInvestmentCardMobile />;
    }

    if (isError) {
        return <ErrorInvestmentCardMobile actionFn={actionFn} />;
    }

    return (
        <InvestmentCardMobileWrapper>
            <div className="grid grid-cols-3 grid-row-2 px-0 py-2 gap-x-4 gap-y-3">
                <div className="pl-4 order-1">
                    <Avatar session={{ img: logo }} className="size-9" />
                </div>
                <h1 className="text-white flex flex-col-reverse pl-4 order-3">
                    <span className="text-xs md:text-base font-light">{title}</span>
                    <small className="text-xs md:text-lg font-medium">{coin}</small>
                </h1>
                <Attributes
                    details={data}
                    className="col-span-2 row-span-2 grid-rows-subgrid grid-cols-subgrid order-2"
                />
            </div>
            <div className="mt-2 px-6 py-4 flex items-center bg-white/20 rounded">
                <p className="w-full text-2xs font-light text-white/50">
                    {participatedDate && `Participated ${participatedDate}`}
                </p>
                <Modal data={data}>
                    <Button className="w-full" variant={canClaim ? "accent" : "outline"}>
                        <span>{canClaim || isClaimSoon ? (canClaim ? "Claim" : "Unlock soon") : "Details"}</span>
                        <ArrowIcon className="ml-2 size-2" />
                    </Button>
                </Modal>
            </div>
        </InvestmentCardMobileWrapper>
    );
};
export default InvestmentCardMobile;
