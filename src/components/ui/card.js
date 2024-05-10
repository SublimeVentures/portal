import { forwardRef } from "react";
import { cva } from 'class-variance-authority';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const cardVariants = cva(
    "group/card py-3.5 px-5 relative rounded transition-base cursor-pointer overflow-hidden",
    {
        variants: {
            variant: {
                default: "card-background",
                accent: "card-background-accent",
                static: "card-gradient",
                none: "",
            },
        },
        defaultVariants: {
            variant: 'default',
            border: 'default',
        },
    }
)

const Card = forwardRef(({ variant, border, className, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
));

Card.displayName = "Card";

const CardIcon = forwardRef(({ icon: Icon, color = "white", className, ...props }, ref) => (
    <div ref={ref} className={cn("size-14 rounded-full flex justify-center items-center", className)} {...props}>
        <Icon className="p-3 text-inherit" />
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

const CardButton = forwardRef(({ className, ...props }, ref) => (
    <Button ref={ref} variant="outline" className={cn("group-hover/card:bg-accent group-hover/card:border-transparent", className)} {...props} />
));

CardButton.displayName = "CardButton";


export { Card, CardIcon, CardTitle, CardDescription, CardButton };
