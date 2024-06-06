import { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";

const Tooltip = dynamic(() => import("react-tooltip").then((mod) => mod.Tooltip), { ssr: false });

export const TooltipType = {
    Success: "app-success",
    Primary: "app-gold",
    Error: "app-error",
    Accent: "app-accent2",
};

export function Tooltiper({ wrapper, text, type = TooltipType.Primary, className = "", ...rest }) {
    const [id] = useState(() => `component-${Math.random().toString(16).slice(2)}`);

    return (
        <>
            <a id={id} className={cn(`text-${type} cursor-pointer`, className)} {...rest} data-tooltip-place="left">
                {wrapper}
            </a>
            <Tooltip
                anchorSelect={`#${id}`}
                className={`basic z-50 ${type === TooltipType.Error ? "bg-app-error opacity-100" : "bg-app-accent2"}`}
                content={text}
                place="left"
            />
        </>
    );
}
