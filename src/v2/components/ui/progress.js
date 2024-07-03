import { forwardRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
 
import { cn } from "@/lib/cn";
 
const Progress = forwardRef(({ className, value, ...props }, ref) => {
    const translateX = 100 - (value || 0);
  
    return (
        <div className="relative">
            <ProgressPrimitive.Root
                ref={ref}
                className={cn(
                    "relative h-2 w-full overflow-hidden rounded-full bg-accent/20",
                    className,
                )}
                {...props}
            >
                <ProgressPrimitive.Indicator
                  className="h-full w-full flex-1 bg-accent rounded"
                  style={{ transform: `translateX(-${translateX}%)` }}
                />
            </ProgressPrimitive.Root>
            
            {(value > 0 && value < 100) ? (
                <div
                    className={`absolute z-20 -top-1 bg-accent w-4 h-4 rounded-full blur`}
                    style={{ right: `calc(${translateX}% - 8px)` }}
                />
            ) : null}
        </div>
    );
});

Progress.displayName = ProgressPrimitive.Root.displayName;
 
export { Progress };
