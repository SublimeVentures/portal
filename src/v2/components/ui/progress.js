import { forwardRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const rootVariants = cva("relative h-1 md:h-1.5 w-full overflow-hidden rounded-full", {
    variants: {
        variant: {
            accent: "bg-accent/20",
            success: "bg-success/20",
        },
    },
    defaultVariants: {
        variant: "accent",
    },
});

const indicatorVariants = cva("h-full w-full flex-1 bg-accent rounded", {
    variants: {
        variant: {
            accent: "bg-accent",
            success: "bg-success",
        },
    },
    defaultVariants: {
        variant: "accent",
    },
});

const blurVariants = cva("absolute z-20 -top-1 w-4 h-4 rounded-full blur", {
    variants: {
        variant: {
            accent: "bg-accent",
            success: "bg-success",
        },
    },
    defaultVariants: {
        variant: "accent",
    },
});

const Progress = forwardRef(({ className, value, variant, ...props }, ref) => {
    const translateX = 100 - (value || 0);

    return (
        <div className="relative">
            <ProgressPrimitive.Root ref={ref} className={cn(rootVariants({ variant }), className)} {...props}>
                <ProgressPrimitive.Indicator
                    className={indicatorVariants({ variant })}
                    style={{ transform: `translateX(-${translateX}%)` }}
                />
            </ProgressPrimitive.Root>

            {value > 0 && value < 100 ? (
                <div className={blurVariants({ variant })} style={{ right: `calc(${translateX}% - 8px)` }} />
            ) : null}
        </div>
    );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
