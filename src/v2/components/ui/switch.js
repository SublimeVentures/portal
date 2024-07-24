import { forwardRef } from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
 
import { cn } from "@/lib/cn";
 
const Switch = forwardRef(({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            "peer h-8 w-16 inline-flex items-center shrink-0 border-2 rounded shadow-sm cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "data-[state=checked]:border-primary data-[state=unchecked]:border-foreground",
            className,
        )}
        {...props}
        ref={ref}
    >
      <SwitchPrimitives.Thumb
          className={cn(
              "m-0.5 block h-6 w-6 rounded-[2px] pointer-events-none transition-transform shadow-lg ring-0",
              "data-[state=checked]:translate-x-6 data-[state=checked]:bg-primary data-[state=unchecked]:bg-foreground",
          )}
      />
    </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;
 
export { Switch };
