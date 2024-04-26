import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

export const SkeletonInvestmentCard = ({ variant = "default" }) => {
    return (
        <Card variant={variant}className="py-8 px-5">
            <div className="mb-8 flex items-center gap-8">
                <div className="w-full flex flex-col gap-2">
                    <Skeleton className="w-3/4" />
                    <Skeleton className="w-full" />
                </div>

                <SkeletonCircle className="size-16" />
            </div>

          <div className="grid grid-cols-2 gap-4">
              <Skeleton count={4} className="w-full" />
              <Skeleton count={4} className="w-full" />
          </div>
          <Skeleton className="mt-8 h-8 w-full" />
        </Card>
    )
}

const InvestmentCard = ({ details }) => {
  const { title, coin, invested = 0, vested = 0, performance = 'TBA', nextUnlock = false, isAvaiable = false, participatedDate, athProfit } = details;
  
  return (
      <Card variant={isAvaiable ? "light" : "default"} className="h-max py-8 px-5">
          <div className="mb-8 flex justify-between items-center">
              <div>
                  <CardTitle className="text-3xl font-medium text-foreground">{title}</CardTitle>
                  <p className='text-md font-light text-foreground'>{coin}</p>
              </div>
              <Avatar className='bg-black'>
                  <AvatarImage />
                  <AvatarFallback>CN</AvatarFallback>
              </Avatar>
          </div>

          <dl className="flex flex-col gap-4">
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

          <Button variant={isAvaiable ? "default" : "outline"} className="mt-7 w-full">
              <span>{isAvaiable ? "Claim" : "Details"}</span>
              <ArrowTopRightIcon />
          </Button>

          {participatedDate && <p className="mt-4 text-xxs font-light text-foreground/[.56] text-center">Participated {participatedDate}</p>}
      </Card>
  )
}

export default InvestmentCard;
