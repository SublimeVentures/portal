import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { Card, CardIcon, CardTitle } from "@/components/ui/card";
import AlertDestructive from "@/components/V2/Layout/AlertDestructive";

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
        <AlertDestructive actionFn={() => {}} />
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
