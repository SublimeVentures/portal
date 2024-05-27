import { Skeleton, SkeletonCircle } from "@/v2/components/ui/skeleton";
import { Button } from "@/v2/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/v2/components/ui/card";
import { AvatarRoot, AvatarImage, AvatarFallback } from "@/v2/components/ui/avatar";
import { cn } from "@/lib/cn";
import ExclamationMark from "@/v2/assets/svg/exclamation-mark.svg";
import { AlertTitle, AlertDescription, AlertIcon } from "@/v2/components/ui/alert";

export const SkeletonPartnershipCard = ({ partnersCount = 1 }) => {    
  return (
      <Card variant="static" className="p-14 pt-20 flex flex-col items-center gap-2">
          <div className="absolute top-0 translate-y-[-50%] flex -space-x-4">
              {Array.from({ length: partnersCount }, (_, index) => <SkeletonCircle key={index} className="size-24" />)}
          </div>
          
          <Skeleton className='my-2 h-6 w-3/5' />
          <Skeleton count={3} className='h-4 w-3/4' />
      </Card>
  )
}

export const ErrorPartnershipCard = () => {    
    return (
        <Card variant="static" className="pt-20 flex flex-col items-center gap-2">
            <div className="absolute top-0 translate-y-[-50%] flex -space-x-4">
                <AlertIcon icon={ExclamationMark} className="bg-destructive size-24 p-2 pb-3" />
            </div>

            <div className="p-4 pb-8 flex flex-col items-center bg-destructive-dark rounded">
                <AlertTitle className="">Error</AlertTitle>
                <AlertDescription className="mt-2 text-center">Unable to fetch data. Please try again.</AlertDescription>
            </div>
            
            <Button variant="destructive" className="mt-auto w-full">Refetch</Button>
        </Card>
    )
  }

const PartnershipCard = ({ title, description, partners = [], isLoading, isError }) => {
    if (isLoading) return <SkeletonPartnershipCard />
    if (isError) return <ErrorPartnershipCard />

    return (
        <Card variant="static" className="p-14 pt-20 flex flex-col items-center gap-3">
            <ul className="absolute top-0 translate-y-[-50%] flex -space-x-4">
                {partners.map(partner => (
                    <li key={partner.id}>
                        <AvatarRoot size="large" className={cn("bg-black shadow-[4px_3px_22px] shadow-black", partner.styles)}>
                            <AvatarImage src={undefined} alt=""  />
                            <AvatarFallback fallback={undefined} />
                        </AvatarRoot>  
                    </li>
                ))}
            </ul>

            <CardTitle className="text-2xl font-regular text-foreground">{title}</CardTitle>
            <CardDescription className="text-sm font-light text-center text-foreground/[.47]">{description}</CardDescription>
        </Card>
    )
}

export default PartnershipCard;
