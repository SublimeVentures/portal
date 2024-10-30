import { forwardRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const rootVariants = cva("relative h-1 md:h-1.5 w-full overflow-hidden rounded-xl", {
    variants: {
        variant: {
            accent: "bg-secondary/20",
            success: "bg-success/20",
        },
    },
    defaultVariants: {
        variant: "accent",
    },
});

const indicatorVariants = cva("h-full w-full flex-1 bg-secondary rounded", {
    variants: {
        variant: {
            accent: "bg-secondary",
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
            accent: "bg-secondary",
            success: "bg-success",
        },
    },
    defaultVariants: {
        variant: "accent",
    },
});

const Progress = forwardRef(({ className, value, variant, ...props }, ref) => {
    if (!Array.isArray(value)) {
        value = [value];
    }

    return (
        <div className="relative">
            <ProgressPrimitive.Root ref={ref} className={cn(rootVariants({ variant }), className)} {...props}>
                {value.map((v, i) => (
                    <ProgressPrimitive.Indicator
                        key={i}
                        className={indicatorVariants({ variant })}
                        style={{
                            transform: `translateX(-${100 - (v || 0)}%)`,
                            opacity: i ? 0.5 : 1,
                            top: 0,
                            position: "absolute",
                        }}
                    />
                ))}
            </ProgressPrimitive.Root>

            {value[0] > 0 && value[0] < 100 ? (
                <div className={blurVariants({ variant })} style={{ right: `calc(${100 - (value[0] || 0)}% - 8px)` }} />
            ) : null}
        </div>
    );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
