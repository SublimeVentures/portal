import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import Link from "next/link";

import { Button } from "@/v2/components/ui/button";
import { cn } from "@/lib/cn";

const cardVariants = cva("group/card py-3.5 px-5 relative rounded transition-base cursor-pointer", {
    variants: {
        variant: {
            default: "border-base hover:border-accent bg-base hover:bg-base",
            accent: "border-accent bg-base",
            static: "border-base bg-base",
            dark: "border-base hover:border-accent bg-alt",
            none: "",
        },
    },
    defaultVariants: {
        variant: "default",
        border: "default",
    },
});

const Card = forwardRef(({ variant, border, className, href, ...props }, ref) => (
    <>
        {href ? (
            <Link ref={ref} href={href} className={cn(cardVariants({ variant, className }))} {...props} />
        ) : (
            <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
        )}
    </>
));

Card.displayName = "Card";

const CardIcon = forwardRef(({ icon: Icon, color = "white", className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("size-10 md:size-14 rounded-full flex justify-center items-center", className)}
        {...props}
    >
        <Icon className="p-2.5 md:p-4 text-inherit" />
    </div>
));

CardIcon.displayName = "CardIcon";

const CardTitle = forwardRef(({ className, ...props }, ref) => (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h3 ref={ref} className={cn("text-white tracking-tight", className)} {...props} />
));

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-white", className)} {...props} />
));

CardDescription.displayName = "CardDescription";

const CardButton = forwardRef(({ className, ...props }, ref) => (
    <Button
        ref={ref}
        variant="outline"
        className={cn(
            "group-hover/card:bg-secondary hover:!bg-secondary-600 group-hover/card:border-transparent",
            className,
        )}
        {...props}
    />
));

CardButton.displayName = "CardButton";

export { Card, CardIcon, CardTitle, CardDescription, CardButton };
