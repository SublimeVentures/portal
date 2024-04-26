import { forwardRef } from "react";
import { cva } from 'class-variance-authority';

import { cn } from "@/lib/cn";

const cardVariants = cva(
    "py-3.5 px-5 relative rounded",
    {
        variants: {
            variant: {
                default: "cardGradient cardBorderPrimary",
                light: "cardGradientLight cardBorderAccent",
                none: "",
                dark: "cardGradientDark",
            },
            border: {
                default: "cardBorderPrimary",
                accent: "cardBorderAccent",
                none: "",
            }
        },
        defaultVariants: {
            variant: 'default',
            border: 'default',
          },
    }
)

const Card = forwardRef(({ variant, border, className, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, border, className }))} {...props} />
));

Card.displayName = "Card";


const CardIcon = forwardRef(({ icon: Icon, className, ...props }, ref) => (
    <div ref={ref} className={cn("size-14 rounded-full flex justify-center items-center", className)} {...props}>
        <Icon className='p-3.5 w-full h-full' />
    </div>
));

CardIcon.displayName = "CardIcon";

const CardTitle = forwardRef(({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-foreground tracking-tight", className)} {...props} />
));

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-foreground",className)} {...props} />
));

CardDescription.displayName = "CardDescription";

export { Card, CardIcon, CardTitle, CardDescription };
