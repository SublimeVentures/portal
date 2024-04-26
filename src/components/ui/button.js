import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
    "py-2 px-8 inline-flex items-center justify-center text-md text-white rounded whitespace-nowrap cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-[#099DB5] hover:bg-[#025770]",
                accent: "bg-[#E5BE83] hover:bg-[#FDC171]",
                outline: "bg-transparent border border-white hover:bg-white/[0.2]",
                secondary: "bg-[#082131] border border-transparent hover:border-[#099DB5] hover:bg-transparent",
                tertiary: "bg-transparent border border-[#099DB5]",
                gradient: "bg-primary-light-gradient hover:bg-primary-gradient",
                link: "p-0 text-[#E5BE83] hover:underline hover:underline-offset-4",
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});

Button.displayName = "Button";

export { Button, buttonVariants };
