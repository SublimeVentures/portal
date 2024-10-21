import { forwardRef } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/lib/cn";

const Checkbox = forwardRef(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            "aspect-square h-4 w-4 shrink-0 rounded border border-white text-white shadow cursor-pointer transition-all",
            "hover:border-secondary hover:shadow-secondary focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:border-white",
            "data-[state=checked]:border-secondary data-[state=checked]:shadow-secondary data-[state=checked]:hover:border-secondary data-[state=checked]:hover:shadow-secondary",
            className,
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator className={cn("relative flex items-center justify-center text-current")}>
            <div className="absolute h-2.5 w-2.5 rounded-[2px] bg-secondary" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const CheckboxField = ({ id, children, ...props }) => (
    <div className="flex items-center space-x-6">
        <Checkbox {...props} id={id} />
        <label
            htmlFor={id}
            className="text-sm font-light text-white leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
            {children}
        </label>
    </div>
);

export { Checkbox, CheckboxField };
