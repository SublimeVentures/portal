import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { AvatarRoot, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import ExclamationMark from "@/assets/v2/svg/exclamation-mark.svg";

export const SkeletonPartnershipCard = ({ partnersCount = 1 }) => {    
  return (
      <Card className="p-14 pt-20 flex flex-col items-center gap-2">
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
        <Card className="pt-20 flex flex-col items-center gap-2">
            <div className="absolute top-0 translate-y-[-50%] flex -space-x-4">
                <div className="size-24 flex items-center justify-center shrink-0 bg-destructive text-white rounded-full">
                    <ExclamationMark className="w-12 h-12" />
                </div>
            </div>

            <p className="text-lg text-center font-light text-destructive">Unable to fetch data. Please check your internet connection and try again. If the problem persists, contact support for further assistance.</p>
            
            <Button variant="destructive" className="mt-auto w-full">Refetch</Button>
        </Card>
    )
  }

const PartnershipCard = ({ title, description, partners = [] }) => {    
  return (
      <Card className="p-14 pt-20 flex flex-col items-center gap-3">
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
