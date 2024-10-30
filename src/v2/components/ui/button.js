import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
    "box-border inline-flex items-center justify-center text-xs sm:text-sm sm:leading-6 text-white rounded transition-all whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none",
    {
        variants: {
            variant: {
                default:
                    "bg-primary border border-primary hover:enabled:bg-primary-600 hover:enabled:border-primary-600",
                accent: "bg-secondary hover:enabled:bg-secondary-600 group-hover/button:bg-secondary-600",
                gradient: "bg-gradient-to-r from-primary to-primary-600 hover:enabled:opacity-80",
                outline: "bg-transparent border border-white hover:bg-white/20 group-hover/button:bg-white/20",
                secondary: "bg-primary/10 hover:bg-primary/30",
                tertiary:
                    "bg-transparent border border-primary-600 hover:enabled:border-primary aria-expanded:border-primary",
                link: "p-0 text-secondary hover:underline hover:underline-offset-4 transition-all",
                destructive: "bg-error hover:enabled:bg-gradient-to-r from-error-600 to-error-700",
            },
            size: {
                small: "py-1.5 px-3 sm:px-6",
                medium: "py-2 px-4 sm:px-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "medium",
        },
    },
);

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
});

Button.displayName = "Button";

export { Button, buttonVariants };
