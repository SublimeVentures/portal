import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

export const SkeletonInvestmentCardMobile = ({ variant = "default" }) => {
    return (
        <Card variant={variant}className="py-8 px-5">
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

const InvestmentCardMobile = ({ details }) => {
    const { title, coin, invested = 0, vested = 0, performance = 'TBA', nextUnlock = false, isAvaiable = false, participatedDate, athProfit } = details;
    
    return (
        <Card variant={isAvaiable ? "light" : "default"} className="h-max">
            <dl className="px-6 py-4 grid grid-cols-3 gap-4">
                <Avatar className='bg-black'>
                    <AvatarImage />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div>
                    <dt className="text-md font-light text-foreground">Invested</dt>
                    <dd className="text-lg font-medium text-foreground">${invested}</dd>
                </div>
                <div>
                    <dt className="text-md font-light text-foreground">Vested</dt>
                    <dd className="text-lg font-medium text-foreground">{vested}%</dd>
                </div>
                <div>
                    <CardTitle className="text-3xl font-medium text-foreground">{title}</CardTitle>
                    <p className='text-md font-light text-foreground'>{coin}</p>
                </div>
                <div>
                        <dt className="text-md font-light text-foreground">Performance</dt>
                        <dd className="text-lg font-medium text-foreground">{performance}</dd>
                    </div>
                    <div>
                        <dt className="text-md font-light text-foreground">Next Unlock</dt>
                        <dd className="text-lg font-medium text-foreground">{nextUnlock ? "Available" : "TBA"}</dd>
                </div>
            </dl>

            <div className='px-6 py-4 flex items-center bg-foreground/[.2] rounded'>
                    <p className="w-full text-xxs font-light text-foreground/[.56]">{participatedDate && `Participated ${participatedDate}`}</p>
                    
                    <Button variant={isAvaiable ? "accent" : "outline"} className="w-full">
                        <span>{isAvaiable ? "Claim" : "Details"}</span>
                        <ArrowTopRightIcon />
                    </Button>
            </div>
        </Card>
    );
};

export default InvestmentCardMobile;
