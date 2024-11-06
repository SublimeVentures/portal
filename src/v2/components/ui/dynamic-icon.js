import React, { useState, useEffect } from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/cn";
import { COLORS, NetworkEnum } from "@/v2/lib/network";

const IconVariants = cva("relative flex justify-center items-center rounded-full", {
    variants: {
        size: {
            default: "p-1.5 size-8",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

const CURRENCY_BG_COLOR = {
    USDC: "#2775CA",
    USDT: "#53AE94",
    ETH: COLORS[NetworkEnum.eth],
    SEPOLIA: COLORS[NetworkEnum.sepolia],
    BASE: COLORS[NetworkEnum.base],
    MATIC: COLORS[NetworkEnum.matic],
    BSC: COLORS[NetworkEnum.bsc],
};

export const DynamicIcon = ({ name = "", size, className, ...props }) => {
    const [Icon, setIcon] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const icon = (await import(`@/v2/assets/svg/${name.toLowerCase()}.svg`)).default;
                setIcon(() => icon);
            } catch (error) {
                console.error(`Failed to load icon: ${name}`, error);
            }
        })();
    }, [name]);

    if (!Icon) return null;

    return (
        <Icon
            className={cn(IconVariants({ size, className }))}
            {...props}
            style={{ background: CURRENCY_BG_COLOR[name.toUpperCase()] }}
        />
    );
};

export const DynamicIconGroup = ({ children, className }) => {
    return <div className={cn("flex items-center -space-x-2", className)}>{children}</div>;
};
