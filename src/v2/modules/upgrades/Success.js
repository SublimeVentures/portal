import { forwardRef } from "react";
import NextImage from "next/image";
import { cn } from "@/lib/cn";
import BackdropCard from "@/v2/modules/upgrades/BackdropCard";

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
        className={cn((className = "text-[12px] 3xl:text-lg text-center 3xl:leading-6 mb-2.5 3xl:mb-3"), className)}
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
            "text-[22px] 3xl:text-9xl text-center 3xl:leading-11 mb-6 3xl:mb-4 font-semibold w-9/12 3xl:w-full",
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
        className={cn("text-[12px] 3xl:text-md text-center 3xl:leading-6 mb-6 3xl:mb-10 w-11/12 3xl:w-8/12", className)}
    >
        {children}
    </p>
));
Description.displayName = "Description";

export const Article = forwardRef(({ children, className, ...props }, ref) => (
    <BackdropCard {...props} ref={ref} className={cn("gap-5 items-center w-full 3xl:w-8/12 mb-6 y-3 px-5", className)}>
        {children}
    </BackdropCard>
));
Article.displayName = "Article";

export const Footer = forwardRef(({ children, className, ...props }, ref) => (
    <p {...props} ref={ref} className={cn("text-[12px] 3xl:text-md text-white/50 text-center", className)}>
        {children}
    </p>
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
