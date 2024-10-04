import { forwardRef } from "react";
import NextImage from "next/image";
import { cn } from "@/lib/cn";
import BackdropCard from "@/v2/modules/upgrades/BackdropCard";
import MutedText from "@/v2/components/ui/muted-text";

export const Content = forwardRef(({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col items-center justify-center w-full", className)} {...props}>
        {children}
    </div>
));
Content.displayName = "Content";

export const Image = forwardRef(({ className, ...props }, ref) => (
    <NextImage className={cn("rounded size-18 -my-1", className)} width={72} height={72} ref={ref} {...props} />
));
Image.displayName = "Image";

export const Kicker = forwardRef(({ children, className, ...props }, ref) => (
    <p
        {...props}
        ref={ref}
        className={cn(
            "text-xs md:text-base font-medium md:font-normal text-center md:leading-6 mb-2.5 md:mb-3",
            className,
        )}
    >
        {children}
    </p>
));
Kicker.displayName = "Kicker";

export const Title = forwardRef(({ children, className, ...props }, ref) => (
    <h1
        {...props}
        ref={ref}
        className={cn(
            "text-xl md:text-3xl text-center md:leading-11 mb-6 md:mb-4 font-semibold w-9/12 md:w-full",
            className,
        )}
    >
        {children}
    </h1>
));
Title.displayName = "Title";

export const Description = forwardRef(({ children, className, ...props }, ref) => (
    <p
        {...props}
        ref={ref}
        className={cn(
            "text-xs md:text-sm md:font-light text-center md:leading-6 mb-6 md:mb-10 w-11/12 md:w-8/12",
            className,
        )}
    >
        {children}
    </p>
));
Description.displayName = "Description";

export const Article = forwardRef(({ children, className, ...props }, ref) => (
    <BackdropCard {...props} ref={ref} className={cn("gap-5 items-center w-full md:w-8/12 mb-6 y-3 px-5", className)}>
        {children}
    </BackdropCard>
));
Article.displayName = "Article";

export const Footer = forwardRef(({ children, ...props }, ref) => (
    <MutedText {...props} ref={ref}>
        {children}
    </MutedText>
));
Footer.displayName = "Footer";

const Success = {
    Content,
    Image,
    Kicker,
    Title,
    Description,
    Article,
    Footer,
};

export default Success;
