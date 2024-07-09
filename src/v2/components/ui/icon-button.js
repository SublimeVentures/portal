import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/cn";

const iconButtonVariants = cva(
    "h-[42px] w-[42px] flex items-center justify-center transition-hover text-white cursor-pointer outline-none",
    {
        variants: {
            variant: {
                default: "bg-navy-300 hover:bg-navy-100",
                primary: "bg-primary shadow-[0px_3px_30px_hsl(var(--primary-color))] hover:bg-primary/[.8]",
                accent: "bg-accent shadow-[0px_3px_30px_hsl(var(--accent-color))] hover:bg-accent/[.8]",
                gradient: "bg-primary-light-gradient text-white",
                transparent: "text-gray-100 bg-transparent hover:bg-navy-300",
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

const IconButton = forwardRef(({ name = "", icon: Icon, comp: Comp = 'button', variant, shape, className, ...props }, ref) => (
    <Comp className={cn(iconButtonVariants({ variant, shape, className }))} ref={ref} {...props}>
        <Icon />
        <span className="sr-only">{name}</span>
    </Comp>
));

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
