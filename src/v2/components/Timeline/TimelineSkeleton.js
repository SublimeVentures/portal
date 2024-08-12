import { Skeleton } from "@/v2/components/ui/skeleton";
import TimelineSVG from "@/v2/assets/svg/timeline.svg";

export default function TimelineSkeleton({ count = 6, showTimeline = true }) {
    return Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex text-sm">
            {showTimeline ? (
                <div className="mx-4 flex flex-col justify-between items-center gap-2 before:w-0 before:border-foreground/[.2] before:border before:h-full after:w-0 after:border after:border-foreground/[.2] after:h-full group-first:before:border-none group-last:after:border-none">
                    <div>
                        <TimelineSVG /> 
                    </div>
                </div>
            ) : null}

            <Skeleton className="h-20 shrink-0" />
        </div>
    ));
};
