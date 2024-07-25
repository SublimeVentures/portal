import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
    "py-1.5 px-6 inline-flex items-center justify-center text-[16px] text-foreground rounded transition-all whitespace-nowrap cursor-pointer leading-5 disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                default: "bg-primary hover:enabled:bg-primary-700",
                accent: "bg-accent hover:enabled:bg-accent-light group-hover/button:bg-accent-light",
                gradient: "bg-primary-light-gradient hover:enabled:opacity-80",
                outline: "bg-transparent border border-foreground hover:enabled:bg-foreground/[0.2] group-hover/button:bg-foreground/[0.2]",
                secondary: "bg-primary-900 hover:enabled:bg-primary-700",
                tertiary: "bg-transparent border border-primary-600 hover:enabled:border-primary aria-expanded:border-primary",
                link: "p-0 text-accent hover:enabled:underline hover:enabled:underline-offset-4",
                destructive: "bg-red-500 hover:enabled:bg-red-800",
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
