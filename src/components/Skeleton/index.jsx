import { cn } from "@/lib/cn";

function Skeleton({ className, ...props }) {
    return <div className={cn("animate-pulse rounded-md skeleton", className)} {...props} />;
}

export { Skeleton };
