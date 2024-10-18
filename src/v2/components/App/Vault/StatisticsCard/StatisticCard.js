import { Skeleton, SkeletonCircle } from "@/v2/components/ui/skeleton";
import { Card, CardIcon, CardTitle } from "@/v2/components/ui/card";
import AlertDestructive from "@/v2/components/Alert/DestructiveAlert";
import { cn } from "@/lib/cn";

export const SkeletonStatisticCard = () => (
    <Card variant="secondary" className="h-max flex items-center">
        <SkeletonCircle className="size-14 bg-secondary/70 mr-5" />
        <div className="w-full">
            <Skeleton className="h-4 my-2 w-4/6 bg-secondary/70" />
            <Skeleton className="h-4 my-2 w-5/6 bg-secondary/70" />
        </div>
    </Card>
);

export const ErrorStatisticCard = ({ actionFn }) => (
    <Card variant="accent" className="h-max flex items-center">
        <AlertDestructive actionFn={actionFn} />
    </Card>
);

const StatisticCard = ({
    title,
    value = 0,
    icon,
    isLoading = false,
    isError = false,
    last = false,
    className,
    iconClassName,
}) => {
    if (isLoading) return <SkeletonStatisticCard />;
    if (isError) return <ErrorStatisticCard actionFn={actionFn} />;
    return (
        <Card variant="accent" className={cn("grow flex items-center gap-x-5 cursor-auto select-none", className)}>
            <CardIcon
                className={cn(
                    "bg-secondary/10 text-secondary shrink-0",
                    { "hidden md:inline-block": last },
                    iconClassName,
                )}
                icon={icon}
            />
            <div className={cn("", { "text-center w-full md:text-left md:w-auto": last })}>
                <CardTitle className="text-xs md:text-sm font-light text-white text-nowrap">{title}</CardTitle>
                <p className="text-sm md:text-lg font-medium text-white font-heading">{value}</p>
            </div>
        </Card>
    );
};

export default StatisticCard;
