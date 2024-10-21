import { Card } from "@/v2/components/ui/card";
import { Skeleton, SkeletonCircle } from "@/v2/components/ui/skeleton";

export default function CardSkeleton() {
    return (
        <Card variant="static" className="p-0 h-max flex flex-col rounded-none rounded-b-[25px]">
            <div className="h-2 rounded bg-gradient-to-r from-primary to-primary-600" />

            <div className="m-3 mb-6 rounded bg-white/5">
                <div className="p-4">
                    <dl className="grid grid-cols-3 grid-rows-2 grid-flow-col gap-x-12">
                        <SkeletonCircle className="mb-2 p-6" />
                        <Skeleton className="p-4" />
                        <Skeleton className="p-4" />
                        <Skeleton className="p-4" />
                        <Skeleton className="p-4" />
                        <Skeleton className="p-4" />
                    </dl>

                    <Skeleton className="p-4" />
                </div>
            </div>
        </Card>
    );
}
