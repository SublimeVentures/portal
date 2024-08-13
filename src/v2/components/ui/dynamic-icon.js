import React, { useState, useEffect } from "react";
import { cva } from 'class-variance-authority';

import { cn } from "@/lib/cn";

const IconVariants = cva(
    "relative flex justify-center items-center rounded-full",
    {
        variants: {
            color: {
                default: "bg-gradient-to-b from-[#164062] to-[#0BB0C8] p-1.5 shadow-[-4px_3px_6px_#0000003D",
            },
            size: {
                default: "p-.1.5 size-8",
            },
        },
        defaultVariants: {
            color: 'default',
            size: 'default',
        },
    }
)

export const DynamicIcon = ({ name, color, size, className, ...props }) => {
    const [Icon, setIcon] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const icon = (await import(`@/v2/assets/svg/${name}.svg`)).default;
                setIcon(() => icon);
            } catch (error) {
                console.error(`Failed to load icon: ${name}`, error);
            }
        })();
    }, [name]);

    if (!Icon) return null;

    return <Icon className={cn(IconVariants({ color, size, className }))} {...props} />
};

export const DynamicIconGroup = ({ children, className }) => {
    return <div className={cn("flex items-center -space-x-2", className)}>{children}</div>
};
