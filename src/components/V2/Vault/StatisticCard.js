import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { Card, CardIcon, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ExclamationMark from "@/assets/v2/svg/exclamation-mark.svg";

export const SkeletonStatisticCard = () => (
  <Card variant="accent" className='h-max flex items-center'>
      <SkeletonCircle className="size-14 bg-accent/[.7] mr-5" />
      <div className='w-full'>
          <Skeleton className="h-4 my-2 w-4/6 bg-accent/[.7]" />
          <Skeleton className="h-4 my-2 w-5/6 bg-accent/[.7]" />
      </div>
  </Card>
);

export const ErrorStatisticCard = () => (
  <Card variant="accent" className='h-max flex items-center'>
      <div className="flex items-center">
          <div className="size-12 flex items-center justify-center shrink-0 bg-destructive text-white rounded-full">
              <ExclamationMark className="p-3" />
          </div>
          <p className="mx-4 p-2 rounded max-w-prose bg-destructive/[.25] text-destructive">Unable to fetch data. Please check your internet connection and try again. If the problem persists, contact support for further assistance.</p>
      </div>

      <Button variant="destructive">Refetch</Button>
  </Card>
);

const StatisticCard = ({ title, value = 0, icon }) => (
  <Card variant="accent" className='h-max flex items-center'>
      <CardIcon className="bg-accent/[.1] text-accent mr-5" icon={icon} />
      <div>
          <CardTitle className="text-md font-light text-foreground">{title}</CardTitle>
          <p className='text-5xl font-medium text-foreground'>{value}</p>
      </div>
  </Card>
);

export default StatisticCard;
