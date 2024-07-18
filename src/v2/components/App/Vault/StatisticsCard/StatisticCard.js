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

const StatisticCard = ({ title, value = 0, icon, isLoading = false, isError = false, last = false }) => {
    if (isLoading) return <SkeletonStatisticCard />;
    if (isError) return <ErrorStatisticCard actionFn={actionFn} />;
    return (
        <Card variant="accent" className={cn("min-w-32 grow flex items-center")}>
            <CardIcon
                className={cn("bg-accent/[.1] text-accent mr-5", { "hidden md:inline-block": last })}
                icon={icon}
            />
            <div className={cn({ "text-center w-full md:text-left md:w-auto": last })}>
                <CardTitle className="text-3xs md:text-md font-light text-foreground">{title}</CardTitle>
                <p className="text-xl md:text-5xl font-medium text-foreground">{value}</p>
            </div>
        </Card>
    );
};

export default StatisticCard;
