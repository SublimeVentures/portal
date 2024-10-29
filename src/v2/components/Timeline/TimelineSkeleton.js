import { Skeleton } from "@/v2/components/ui/skeleton";
import TimelineSVG from "@/v2/assets/svg/timeline.svg";

export default function TimelineSkeleton({ showTimeline = true }) {
    return (
        <div className="flex text-sm">
            {showTimeline ? (
                <div className="mx-4 flex flex-col justify-between items-center gap-2 before:w-0 before:border-white/20 before:border before:h-full after:w-0 after:border after:border-white/20 after:h-full group-first:before:border-none group-last:after:border-none">
                    <div>
                        <TimelineSVG />
                    </div>
                </div>
            ) : null}

            <Skeleton className="my-2 h-23" />
        </div>
    );
}
