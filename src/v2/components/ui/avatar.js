import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/cn";

const avatarVariants = cva(
    "relative flex shrink-0 bg-black overflow-hidden rounded-full",
    {
        variants: {
            variant: {
                default: "rounded-full",
                block: "rounded",
            },
            size: {
                default: "h-[55px] w-[55px]",
                small: "h-[51px] w-[51px]",
                large: "h-[100px] w-[100px]",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

const AvatarRoot = forwardRef(({ variant, size, className, ...props }, ref) => (
    <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ variant, size, className }))} {...props} />
));

AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = forwardRef(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));

AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = forwardRef(({ fallback, className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        src={fallback}
        className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
        {...props}
    />
));

AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const Avatar = forwardRef(({ session, ...props }, ref) => (
    <AvatarRoot ref={ref} {...props}>
        <AvatarImage src={session?.img} />
        <AvatarFallback fallback={session?.img_fallback} />
    </AvatarRoot>
));

Avatar.displayName = AvatarPrimitive.Avatar.displayName;

export { Avatar, AvatarRoot, AvatarImage, AvatarFallback };
