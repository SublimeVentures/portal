import { forwardRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/cn";

const Pagination = ({ className, ...props }) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
    />
);

Pagination.displayName = "Pagination";

const PaginationContent = forwardRef(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("relative flex flex-row items-center gap-4 bg-primary-800 rounded", className)}
        {...props}
    />
));

PaginationContent.displayName = "PaginationContent";

const PaginationItem = forwardRef(({ className, ...props }, ref) => <li ref={ref} className={className} {...props} />);

PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ className, isActive, size = "icon", ...props }) => (
    <Link
        aria-current={isActive ? "page" : undefined}
        className={cn(
            "p-3 h-10 w-10 flex items-center justify-center text-sm text-white rounded cursor-pointer",
            isActive ? "bg-secondary shadow-secondary" : "bg-primary-800 hover:bg-primary-700",
        )}
        {...props}
    />
);

PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }) => (
    <Link
        aria-label="Go to previous page"
        className={cn(
            "absolute -left-13 p-3 h-10 w-10 flex items-center justify-center text-white bg-primary-800 rounded hover:bg-primary-700",
            className,
        )}
        {...props}
    >
        <ChevronLeftIcon />
    </Link>
);

PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }) => (
    <Link
        aria-label="Go to next page"
        className={cn(
            "absolute -right-13 p-3 h-10 w-10 flex items-center justify-center text-white bg-primary-800 rounded hover:bg-primary-700",
            className,
        )}
        {...props}
    >
        <ChevronRightIcon />
    </Link>
);

PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }) => (
    <span
        aria-hidden
        className={cn(
            "p-3 h-10 w-10 flex items-center justify-center text-sm text-white pointer-events-none",
            className,
        )}
        {...props}
    >
        <span className="sr-only">More pages</span>
        <span>...</span>
    </span>
);

PaginationEllipsis.displayName = "PaginationEllipsis";

export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
};
