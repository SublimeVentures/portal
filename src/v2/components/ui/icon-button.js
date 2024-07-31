import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const iconButtonVariants = cva(
    "flex items-center justify-center shrink-0 transition-hover text-white cursor-pointer outline-none",
    {
        variants: {
            variant: {
                default: "bg-navy-300 hover:bg-navy-100",
                primary: "bg-primary shadow shadow-primary hover:bg-primary/[.8] group-hover/button:bg-primary/[.8]",
                accent: "bg-accent shadow shadow-accent hover:bg-accent/[.8] group-hover/button:bg-accent/[.8]",
                gradient: "bg-primary-light-gradient text-white",
                outline: "bg-transparent border border-white text-white",
                transparent: "text-gray-100 bg-transparent hover:bg-navy-300",
            },
            shape: {
                default: "rounded",
                circle: "rounded-full",
            },
            size: {
                8: "size-8 p-2.5",
                default: "size-10 p-3.5",
            },
        },
        defaultVariants: {
            variant: "default",
            shape: "default",
            size: "default",
        },
    },
);

const IconButton = forwardRef(
    ({ name = "", icon: Icon, comp: Comp = "button", variant, shape, className, size, ...props }, ref) => (
        <Comp className={cn(iconButtonVariants({ variant, shape, className, size }))} ref={ref} {...props}>
            <Icon />
            <span className="sr-only">{name}</span>
        </Comp>
    ),
);

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
