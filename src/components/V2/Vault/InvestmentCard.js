import { Avatar } from "@/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { Card, CardButton, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ArrowIcon from "@/assets/v2/svg/arrow.svg";

export const SkeletonInvestmentCard = () => {
    return (
        <Card className="flex flex-col py-8 px-5">
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
        </Card>
    )
}

export const ErrorInvestmentCard = () => {
    return (
        <Card className="flex flex-col py-8 px-5">
            <div className="py-4">
                <div className="mb-2 flex grow items-center">
                    <div className="mr-2 h-6 w-6 flex items-center justify-center shrink-0 bg-destructive/[.25] text-destructive rounded-full">!</div>
                    <h3 className="text-4xl font-bold text-destructive">Error</h3>
                </div>
                
                <p className="text-lg font-light text-destructive">Unable to fetch data. Please check your internet connection and try again. If the problem persists, contact support for further assistance.</p>
            </div>

            <Button variant="destructive" className="mt-auto w-full">Refetch</Button>
        </Card>
    )
}

const InvestmentCard = ({ details }) => {
  const { title, coin, invested = 0, vested = 0, performance = 'TBA', nextUnlock = false, isAvaiable = false, participatedDate, athProfit } = details;

  const isHovered = false;
  
  return (
      <Card className="flex flex-col py-8 px-5">
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

          <CardButton className="mt-auto w-full">
              <span>{isAvaiable ? "Claim" : "Details"}</span>
              <ArrowIcon className="ml-2" />
          </CardButton>

          {participatedDate && <p className="mt-4 text-xxs font-light text-foreground/[.56] text-center">Participated {participatedDate}</p>}
      </Card>
  )
}

export default InvestmentCard;
