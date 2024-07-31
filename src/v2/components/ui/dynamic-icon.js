import React, { useState, useEffect } from "react";

import { cn } from "@/lib/cn";

export const DynamicIcon = ({ name, style }) => {
    const [Icon, setIcon] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const icon = (await import(`@/assets/svg/${name}.svg`)).default;
                setIcon(() => icon);
            } catch (error) {
                console.error(`Failed to load icon: ${name}`, error);
            }
        })();
    }, [name]);

    if (!Icon) return null;

    return <Icon className={cn("h-8 w-8 bg-gradient-to-b from-[#164062] to-[#0BB0C8] rounded-full p-1.5 shadow-[-4px_3px_6px_#0000003D]", ...style)} />
};

export const DynamicIconGroup = ({ children }) => {
    return <div className="flex items-center -space-x-2">{children}</div>
};
