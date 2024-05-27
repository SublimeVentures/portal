import { useRef, useEffect } from "react";
import VanillaTilt from "vanilla-tilt";

import { Avatar } from "@/v2/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/v2/components/ui/skeleton";
import { Card, CardButton, CardTitle } from "@/v2/components/ui/card";
import AlertDestructive from "@/v2/components/Alert/DestructiveAlert";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";

// aspect-[5/8]
const InvestmentCardWrapper = ({ children }) => {
    const tilt = useRef(null);
    useEffect(() => VanillaTilt.init(tilt.current, { scale: 1.02, speed: 1000, max: 2 }), []);

    return (
        <Card ref={tilt} className="relative flex flex-col py-8 px-5 h-full w-full">
            {children}
        </Card>
    )
}

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
    )
}

export const ErrorInvestmentCard = ({ actionFn }) => {
    return (
        <InvestmentCardWrapper>
            <AlertDestructive variant="column" actionFn={actionFn} />
        </InvestmentCardWrapper>
    )
}

const InvestmentCard = ({ details, isLoading = false, isError = false }) => {
    const { title, coin, invested = 0, vested = 0, performance = 'TBA', nextUnlock = false, isAvaiable = false, participatedDate, athProfit } = details;

    if (isLoading) {
        return <SkeletonInvestmentCard />
    }

    if (isError) {
        return <ErrorInvestmentCard actionFn={() => {}}/>
    }
  
    return (
        <InvestmentCardWrapper>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <CardTitle className="pb-2 text-3xl font-medium text-foreground leading-none">{title}</CardTitle>
                    <p className='text-md font-light text-foreground leading-none'>{coin}</p>
                </div>
                <Avatar session={null} />
            </div>

            <dl className="mb-7 flex flex-col grow gap-4">
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Invested</dt>
                    <dd className="text-lg font-medium text-foreground">${invested}</dd>
                </div>

                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Vested</dt>
                    <dd className="text-lg font-medium text-foreground">{vested}%</dd>
                </div>

                {athProfit ? (
                    <div className="flex justify-between items-center">
                        <dt className="text-md font-light text-foreground text-foreground/[.4]">ATH Profit</dt>
                        <dd className="text-lg font-medium text-foreground text-foreground/[.4]">SOON</dd>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <dt className="text-md font-light text-foreground">Performance</dt>
                        <dd className="text-lg font-medium text-foreground">{performance}</dd>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Next Unlock</dt>
                    <dd className="text-lg font-medium text-foreground">{nextUnlock ? "Available" : "TBA"}</dd>
                </div>
            </dl>

            <CardButton className="mb-2 mt-auto w-full">
                <span>{isAvaiable ? "Claim" : "Details"}</span>
                <ArrowIcon className="ml-2" />
            </CardButton>

            {participatedDate && <p className="absolute left-0 bottom-1 py-2 w-full text-xxs font-light text-foreground/[.56] text-center">Participated {participatedDate}</p>}
        </InvestmentCardWrapper>
    )
}

export default InvestmentCard;
