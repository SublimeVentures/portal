import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ArrowIcon from "@/assets/v2/svg/arrow.svg";

export const SkeletonInvestmentRow = ({ variant = "default", border = "default" }) => {
    return (
        <Card variant={variant} border={border} className="h-max py-5 px-8">
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

const InvestmentRow = ({ details }) => {
  const { title, coin, invested = 0, vested = 0, performance = 'TBA', nextUnlock = false, isAvaiable = false, participatedDate } = details;
  
    return (
        <Card variant={isAvaiable ? "light" : "default"} className="h-max py-5 px-8">
            <div className="grid grid-cols-8 items-center">
                <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div>
                    <CardTitle className="text-2xl font-medium text-foreground">{title}</CardTitle>
                    <p className='text-md font-light text-foreground'>{coin}</p>
                </div>

                    <div>
                        <dd className="text-2xl font-medium text-foreground">${invested}</dd>
                        <dt className="text-md font-light text-foreground">Invested</dt>
                    </div>
                    <div>
                        <dd className="text-2xl font-medium text-foreground">{vested}%</dd>
                        <dt className="text-md font-light text-foreground">Vested</dt>
                    </div>
                    <div>
                        <dd className="text-2xl font-medium text-foreground">{performance}</dd>
                        <dt className="text-md font-light text-foreground">Performance</dt>
                    </div>
                    <div>
                        <dd className="text-2xl font-medium text-foreground">${invested}</dd>
                        <dt className="text-md font-light text-foreground">Next Unlock</dt>
                    </div>

                    <p className="text-xxs font-light text-foreground/[.56]">
                        {participatedDate && `Participated ${participatedDate}`}
                    </p>
                  
                  <Button variant={isAvaiable ? "accent" : "outline"}>
                      <span>{isAvaiable ? "Claim" : "Details"}</span>
                      <ArrowIcon className="ml-2" />
                  </Button>
            </div>
        </Card>
    )
}

export default InvestmentRow;
