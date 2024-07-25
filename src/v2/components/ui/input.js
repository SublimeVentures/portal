import { forwardRef } from "react";

import { cn } from "@/lib/cn";

const Input = forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "py-3 px-4 w-full text-md text-foreground bg-primary/[.05] border-2 border-primary/[.7] rounded shadow-sm transition-colors",
                "hover:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
                {
                  "border-red-500 bg-red-500/[.3] hover:border-red-500": props['aria-invalid'],
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
