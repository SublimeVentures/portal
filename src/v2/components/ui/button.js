import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
    "py-2 px-8 inline-flex items-center justify-center text-md text-white rounded transition-hover whitespace-nowrap cursor-pointer leading-none",
    {
        variants: {
            variant: {
                default: "bg-navy-100 hover:bg-navy-200",
                accent: "bg-accent hover:bg-accent-light",
                outline: "bg-transparent border border-white hover:bg-foreground/[0.2]",
                secondary: "bg-gray-300 border border-transparent hover:border-navy-100 hover:bg-transparent",
                tertiary: "bg-transparent border border-navy-100 hover:border-gray-300 hover:bg-gray-300",
                gradient: "bg-primary-light-gradient font-semibold hover:opacity-70",
                link: "p-0 text-accent hover:underline hover:underline-offset-4",
                destructive: "bg-destructive hover:bg-destructive/[.8]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
});

Button.displayName = "Button";

export { Button, buttonVariants };
