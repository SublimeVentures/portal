import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/cn";

const iconButtonVariants = cva(
    "h-[42px] w-[42px] flex items-center justify-center text-white cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-[#164263] hover:bg-[#099DB5]",
                accent: "bg-accent shadow-[0px_3px_30px_hsl(var(--accent-color))] hover:bg-accent/[.8]",
                gradient: "bg-primary-light-gradient text-white",
                transparent: "text-[#AEB3B8] bg-transparent hover:bg-[#164263]",
            },
            shape: {
                default: "rounded",
                circle: "rounded-full",
            }
        },
        defaultVariants: {
            variant: "default",
            shape: "default",
        },
    },
);

const IconButton = forwardRef(({ name = "", icon: Icon, variant, shape, className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
        <Comp className={cn(iconButtonVariants({ variant, shape, className }))} ref={ref} {...props}>
            <Icon className="p-3 flex items-center justify-between" />
            <span className="sr-only">{name}</span>
        </Comp>
    )
});

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
