import { useRef, useEffect } from "react";
import VanillaTilt from "vanilla-tilt";

import { Avatar } from "@/v2/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/v2/components/ui/skeleton";
import { Card, CardTitle, CardButton } from "@/v2/components/ui/card";
import AlertDestructive from "@/v2/components/Alert/DestructiveAlert";
import { cn } from "@/lib/cn";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";

const InvestmentCardMobileWrapper = ({ children, className }) => {
    const tilt = useRef(null);
    useEffect(() => VanillaTilt.init(tilt.current, { scale: 1.02, speed: 1000, max: 2 }), []);

    return <Card ref={tilt} className={cn("h-max py-8 px-5", className)}>{children}</Card>
}


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
                <Skeleton className="h-8"/>
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
    const { title, coin, invested = 0, vested = 0, performance = 'TBA', nextUnlock = false, isAvaiable = false, participatedDate, athProfit } = details;

    if (isLoading) {
        return <SkeletonInvestmentCardMobile />
    }

    if (isError) {
        return <ErrorInvestmentCardMobile actionFn={actionFn} />
    }

    return (
        <InvestmentCardMobileWrapper>
            <dl className="px-6 py-4 grid grid-cols-3 items-center gap-4">
                <Avatar session={null} />

                <div>
                    <dt className="mb-2 text-md font-light text-foreground leading-none">Invested</dt>
                    <dd className="text-lg font-medium text-foreground">${invested}</dd>
                </div>
                <div>
                    <dt className="mb-2 text-md font-light text-foreground leading-none">Vested</dt>
                    <dd className="text-lg font-medium text-foreground leading-none">{vested}%</dd>
                </div>
                <div>
                    <CardTitle className="mb-2 text-3xl font-medium text-foreground leading-none">{title}</CardTitle>
                    <p className='text-md font-light text-foreground leading-none'>{coin}</p>
                </div>
                <div>
                    <dt className="mb-2 text-md font-light text-foreground leading-none">Performance</dt>
                    <dd className="text-lg font-medium text-foreground leading-none">{performance}</dd>
                </div>
                <div>
                    <dt className="mb-2 text-md font-light text-foreground leading-none">Next Unlock</dt>
                    <dd className="text-lg font-medium text-foreground leading-none">{nextUnlock ? "Available" : "TBA"}</dd>
                </div>
            </dl>

            <div className='mt-2 px-6 py-4 flex items-center bg-foreground/[.2] rounded'>
                <p className="w-full text-xxs font-light text-foreground/[.56]">{participatedDate && `Participated ${participatedDate}`}</p>
                    
                <CardButton className="w-full">
                    <span>{isAvaiable ? "Claim" : "Details"}</span>
                    <ArrowIcon className="ml-2" />
                </CardButton>
            </div>
        </InvestmentCardMobileWrapper>
    );
};

export default InvestmentCardMobile;
