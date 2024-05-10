import { Avatar } from "@/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { Card, CardTitle, CardButton } from "@/components/ui/card";
import AlertDestructive from "@/components/v2/Layout/AlertDestructive";
import ArrowIcon from "@/assets/v2/svg/arrow.svg";

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
            <AlertDestructive />
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
