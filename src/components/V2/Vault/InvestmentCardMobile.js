import { Avatar } from "@/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { Card, CardTitle, CardButton } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AlertDestructive from "@/components/V2/Layout/AlertDestructive";
import ArrowIcon from "@/assets/v2/svg/arrow.svg";

export const SkeletonInvestmentCardMobile = () => {
    return (
        <Card className="py-8 px-5">
            <div className="px-6 py-4 grid grid-cols-3 gap-4">
                <SkeletonCircle className="size-14" />
                <div>
                    <Skeleton count={2} className="my-1" />
                </div>
                <div>
                    <Skeleton count={2} className="my-1" />
                </div>
                <div>
                    <Skeleton count={2} className="my-1" />
                </div>
                <div>
                    <Skeleton count={2} className="my-1" />
                </div>
                <div>
                    <Skeleton count={2} className="my-1" />
                </div>
            </div>

            <div className="mx-5">
                <Skeleton className="h-8"/>
            </div>
        </Card>
    );
};

export const ErrorInvestmentCardMobile = () => {
    return (
        <Card>
            <AlertDestructive variant="column" actionFn={() => {}} />
        </Card>
    );
};

const InvestmentCardMobile = ({ details }) => {
    const { title, coin, invested = 0, vested = 0, performance = 'TBA', nextUnlock = false, isAvaiable = false, participatedDate, athProfit } = details;
    
    return (
        <Card className="h-max">
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
        </Card>
    );
};

export default InvestmentCardMobile;
