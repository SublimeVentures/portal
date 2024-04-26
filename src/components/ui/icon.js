import { forwardRef } from "react";
import { cva } from 'class-variance-authority';

import { cn } from "@/lib/cn";

const IconVariants = cva(
    "relative flex justify-center items-center rounded-full",
    {
        variants: {
            color: {
                default: "text-[#09A0B8] bg-[#09A0B8]/[.1]",
                accent: "text-[#E5BE83] bg-[#E5BE83]/[.1]",
                destructive: "text-destructive bg-destructive/[.1]",
            },
            size: {
                default: "size-14",
            },
        },
        defaultVariants: {
            color: 'default',
            size: 'default',
        },
    }
)

const Icon = forwardRef(({ icon: Icon, color, size, className, ...props }, ref) => (
    <div ref={ref} className={cn(IconVariants({ color, size, className }))} {...props}>
        <Icon className='p-3.5 w-full h-full' />
    </div>
));

Icon.displayName = "Icon";

export { Icon, IconVariants };
