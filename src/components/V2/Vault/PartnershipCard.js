import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const SkeletonPartnershipCard = () => {    
  return (
      <Card className="p-14 pt-20 flex flex-col items-center gap-2">
          <div className="absolute top-0 translate-y-[-50%] flex -space-x-4">
              <SkeletonCircle className="size-24" />
              <SkeletonCircle className="size-24"/>
          </div>
          
          <Skeleton className='my-2 h-6 w-3/5' />
          <Skeleton count={3} className='h-4 w-3/4' />
      </Card>
  )
}

const PartnershipCard = ({ title, description }) => {    
  return (
      <Card className="p-14 pt-20 flex flex-col items-center gap-3">
          <div className="absolute top-0 translate-y-[-50%] flex -space-x-4">
              <Avatar size="large" className="bg-black">
                  <AvatarImage src="" alt=""  />
                  <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar size="large" className="bg-primary shadow-[4px_3px_22px_#0BAFC7]">
                  <AvatarImage src="" alt="" />
                  <AvatarFallback>CN</AvatarFallback>
              </Avatar>
          </div>
          <CardTitle className="text-2xl font-regular text-foreground">{title}</CardTitle>
          <CardDescription className="text-sm font-light text-center text-foreground/[.47]">{description}</CardDescription>
      </Card>
  )
}

export default PartnershipCard;
