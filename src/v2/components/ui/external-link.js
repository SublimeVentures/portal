import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";

const ExternalLink = forwardRef(({ children = "Read more", className, href, ...props }, ref) => (
    <Link
        ref={ref}
        className={cn(
            "text-primary hover:underline inline-flex items-center font-normal group/external-link",
            className,
        )}
        target="_blank"
        rel="noopener noreferrer"
        href={href}
        {...props}
    >
        {children}
        <ArrowIcon className="size-[0.57em] mx-[0.28em] transition-transform group-hover/external-link:-translate-y-0.5 group-hover/external-link:translate-x-0.5" />
    </Link>
));

ExternalLink.displayName = "ExternalLink";

export default ExternalLink;
