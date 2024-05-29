import { cn } from "@/lib/cn";

const Skeleton = ({ count = 1, className, ...props }) => Array.from({ length: count }).map((_, index) => (
    <div key={index} className={cn("animate-pulse h-4 w-full rounded transition-hover bg-navy-400", className)} {...props} />
));

const SkeletonCircle = ({ className, ...props }) => <div className={cn("animate-pulse size-4 shrink-0 rounded-full transition-hover bg-navy-400", className)} {...props} />

export { Skeleton, SkeletonCircle };
