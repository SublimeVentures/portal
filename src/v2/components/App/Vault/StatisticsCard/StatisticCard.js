import { Skeleton, SkeletonCircle } from "@/v2/components/ui/skeleton";
import { Card, CardIcon, CardTitle } from "@/v2/components/ui/card";
import AlertDestructive from "@/v2/components/Alert/DestructiveAlert";
import { cn } from "@/lib/cn";

export const SkeletonStatisticCard = () => (
    <Card variant="accent" className="h-max flex items-center">
        <SkeletonCircle className="size-14 bg-accent/[.7] mr-5" />
        <div className="w-full">
            <Skeleton className="h-4 my-2 w-4/6 bg-accent/[.7]" />
            <Skeleton className="h-4 my-2 w-5/6 bg-accent/[.7]" />
        </div>
    </Card>
);

export const ErrorStatisticCard = ({ actionFn }) => (
    <Card variant="accent" className="h-max flex items-center">
        <AlertDestructive actionFn={actionFn} />
    </Card>
);

const StatisticCard = ({ title, value = 0, icon, isLoading = false, isError = false, last = false, className }) => {
    if (isLoading) return <SkeletonStatisticCard />;
    if (isError) return <ErrorStatisticCard actionFn={actionFn} />;
    return (
        <Card variant="accent" className={cn("grow flex items-center gap-x-5", className)}>
            <CardIcon
                className={cn("bg-accent/[.1] text-accent shrink-0", { "hidden md:inline-block": last })}
                icon={icon}
            />
            <div className={cn("", { "text-center w-full md:text-left md:w-auto": last })}>
                <CardTitle className="text-xs md:text-sm font-light text-foreground text-nowrap">{title}</CardTitle>
                <p className="text-sm md:text-lg font-medium text-foreground">{value}</p>
            </div>
        </Card>
    );
};

export default StatisticCard;
