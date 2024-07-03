import { forwardRef } from "react";

import { cn } from "@/lib/cn";

const Input = forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "py-2 px-4 w-full bg-foreground/[.1] border border-foreground/[.1] text-foreground/[.6] text-md shadow-sm transition-colors rounded ocus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                {
                  "border-red-500": props['aria-invalid'],
                },
                className,
            )}
            ref={ref}
            {...props}
        />
    );
})

Input.displayName = "Input";

export { Input };
