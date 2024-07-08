import { forwardRef } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
 
import { cn } from "@/lib/cn";

const Checkbox = forwardRef(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "aspect-square h-4 w-4 shrink-0 rounded border border-foreground text-foreground shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-20",
          "data-[state=checked]:border-accent data-[state=checked]:shadow-[0_3px_30px_#FDC171]",
          className,
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
            <div className="h-2.5 w-2.5 rounded-[2px] bg-accent" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const CheckboxField = ({ id, children, ...props }) => (
    <div className="flex items-center space-x-6">
        <Checkbox {...props} id={id} />
        <label htmlFor={id} className="text-md text-foreground leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{children}</label>
    </div>
)

export { Checkbox, CheckboxField };
