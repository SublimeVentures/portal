import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
    "py-2 px-8 inline-flex items-center justify-center text-xs md:text-md text-white rounded transition-hover transition-colors whitespace-nowrap cursor-pointer leading-5",
    {
        variants: {
            variant: {
                default: "bg-primary hover:bg-primary-700 border border-primary hover:border-primary-700",
                accent: "border bg-accent border-accent hover:bg-accent-light hover:border-accent-light group-hover/button:bg-accent-light group-hover/button:border-accent-light",
                outline:
                    "bg-transparent border border-white hover:bg-foreground/[0.2] group-hover/button:bg-foreground/[0.2]",
                secondary: "bg-primary-900 hover:bg-primary-800 border border-primary-900 hover:border-primary-800",
                tertiary: "bg-transparent border border-primary-600 hover:border-primary aria-expanded:border-primary",
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
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
});

Button.displayName = "Button";
export { Button, buttonVariants };
