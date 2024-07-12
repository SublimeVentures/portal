import { forwardRef } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
 
import { cn } from "@/lib/cn";
 
const RadioGroup = forwardRef(({ className, ...props }, ref) => {
    return <RadioGroupPrimitive.Root className={cn("grid gap-4", className)} {...props} ref={ref} />
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
 
const RadioGroupItem = forwardRef(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
                "aspect-square h-4 w-4 rounded-full border border-foreground text-foreground shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-20",
                "data-[state=checked]:border-accent data-[state=checked]:shadow-accent",
                className
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-accent" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
 
export { RadioGroup, RadioGroupItem };
