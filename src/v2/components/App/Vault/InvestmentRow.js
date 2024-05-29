import { useRef, useEffect } from "react";
import VanillaTilt from "vanilla-tilt";

import { Avatar } from "@/v2/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/v2/components/ui/skeleton";
import { Card, CardTitle, CardButton } from "@/v2/components/ui/card";
import AlertDestructive from "@/v2/components/Alert/DestructiveAlert";
import { cn } from "@/lib/cn";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";

const InvestmentRowWrapper = ({ children, className }) => {
    const tilt = useRef(null);
    useEffect(() => VanillaTilt.init(tilt.current, { scale: 1.02, speed: 1000, max: 2 }), []);

    return <Card ref={tilt} className={cn("h-max py-5 px-8", className)}>{children}</Card>
}

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
    )
}

export const ErrorInvestmentRow = ({ actionFn }) => {
    return (
        <InvestmentRowWrapper>
            <AlertDestructive actionFn={actionFn} />
        </InvestmentRowWrapper>
    )
}


const InvestmentRow = ({ details, isLoading = false, isError = false }) => {
    const { title, coin, invested = 0, vested = 0, performance = 'TBA', nextUnlock = false, isAvaiable = false, participatedDate } = details;

    if (isLoading) {
        return <SkeletonInvestmentRow />
    }

    if (isError) {
        return <ErrorInvestmentRow actionFn={() => {}}/>
    }

    return (
        <InvestmentRowWrapper>
            <div className="grid grid-cols-8 items-center">
                <Avatar session={null} />

                <div>
                    <CardTitle className="mb-1 text-2xl font-medium text-foreground leading-none">{title}</CardTitle>
                    <p className='text-md font-light text-foreground'>{coin}</p>
                </div>

                    <div>
                        <dd className="mb-1 text-2xl font-medium text-foreground leading-none">${invested}</dd>
                        <dt className="text-md font-light text-foreground">Invested</dt>
                    </div>
                    <div>
                        <dd className="mb-1 text-2xl font-medium text-foreground leading-none">{vested}%</dd>
                        <dt className="text-md font-light text-foreground">Vested</dt>
                    </div>
                    <div>
                        <dd className="mb-1 text-2xl font-medium text-foreground leading-none">{performance}</dd>
                        <dt className="text-md font-light text-foreground">Performance</dt>
                    </div>
                    <div>
                        <dd className="mb-1 text-2xl font-medium text-foreground leading-none">${invested}</dd>
                        <dt className="text-md font-light text-foreground">Next Unlock</dt>
                    </div>

                    <p className="text-xxs font-light text-foreground/[.56]">
                        {participatedDate && `Participated ${participatedDate}`}
                    </p>
                  
                  <CardButton>
                    <span>{isAvaiable ? "Claim" : "Details"}</span>
                    <ArrowIcon className="ml-2" />
                </CardButton>
            </div>
        </InvestmentRowWrapper>
    )
}

export default InvestmentRow;
