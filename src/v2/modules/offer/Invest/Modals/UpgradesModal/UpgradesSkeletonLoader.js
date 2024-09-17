import { Skeleton } from "@/v2/components/ui/skeleton";

export default function UpgradesSkeletonLoader() {
    return (
        <div className="flex items-center gap-4">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px]" />
        </div>
    );
}
