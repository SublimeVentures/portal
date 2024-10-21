import { forwardRef } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/cn";

const RadioGroup = forwardRef(({ className, ...props }, ref) => {
    return <RadioGroupPrimitive.Root className={cn("grid gap-4", className)} {...props} ref={ref} />;
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = forwardRef(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
                "aspect-square h-4 w-4 shrink-0 rounded-full border border-white text-white shadow cursor-pointer transition-all",
                "hover:border-secondary hover:shadow-secondary focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:border-white",
                "data-[state=checked]:border-secondary data-[state=checked]:shadow-secondary data-[state=checked]:hover:border-secondary data-[state=checked]:hover:shadow-secondary",
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
