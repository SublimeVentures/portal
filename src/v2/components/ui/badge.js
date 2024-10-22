import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-3 py-0.5 text-xs md:text-sm font-light rounded-full shadow focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-black/50 text-white",
                success: "border-transparent bg-success-500/20 text-success-500",
                warning: "border-transparent bg-yellow-500/20 text-yellow-500",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

function Badge({ className, variant, ...props }) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
