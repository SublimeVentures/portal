import { Avatar } from "@/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { Card, CardTitle, CardButton } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ArrowIcon from "@/assets/v2/svg/arrow.svg";
import ExclamationMark from "@/assets/v2/svg/exclamation-mark.svg";

export const SkeletonInvestmentRow = () => {
    return (
        <Card className="h-max py-5 px-8">
            <div className="grid grid-cols-8 items-center gap-16">
                <SkeletonCircle className="size-16" />

                <div>
                    <Skeleton className="w-3/4 h-4 my-2" />
                    <Skeleton className="w-full h-3" />
                </div>
                <div>
                <Skeleton className="w-3/4 h-4 my-2" />
                    <Skeleton className="w-full h-3" />
                </div>
                <div>
                <Skeleton className="w-3/4 h-4 my-2" />
                    <Skeleton className="w-full h-3" />
                </div>
                <div>
                <Skeleton className="w-3/4 h-4 my-2" />
                    <Skeleton className="w-full h-3" />
                </div>

                <Skeleton className="w-full" />
                <Skeleton className="w-full" />
                <Skeleton className="w-full" />
            </div>
        </Card>
    )
}

export const ErrorInvestmentRow = () => {
    return (
        <Card className="h-max py-5 px-8 flex items-center justify-between">
            <div className="flex items-center">
                <div className="size-12 flex items-center justify-center shrink-0 bg-destructive text-white rounded-full">
                    <ExclamationMark className="p-3" />
                </div>
                <p className="ml-4 p-2 rounded max-w-prose bg-destructive/[.25] text-destructive">Unable to fetch data. Please check your internet connection and try again. If the problem persists, contact support for further assistance.</p>
            </div>

            <Button variant="destructive">Refetch</Button>
        </Card>
    )
}


const InvestmentRow = ({ details }) => {
  const { title, coin, invested = 0, vested = 0, performance = 'TBA', nextUnlock = false, isAvaiable = false, participatedDate } = details;
  
    return (
        <Card className="h-max py-5 px-8">
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
        </Card>
    )
}

export default InvestmentRow;
