import { useState } from "react";
import dynamic from "next/dynamic";
const Tooltip = dynamic(
    () => import("react-tooltip").then((mod) => mod.Tooltip),
    { ssr: false },
);

export const TooltipType = {
    Success: "app-success",
    Primary: "app-gold",
    Error: "app-error",
    Accent: "app-accent2",
};

export function Tooltiper({ wrapper, text, type }) {
    const [id] = useState(
        () => `component-${Math.random().toString(16).slice(2)}`,
    );

    return (
        <div className={"inline-block tooltip"}>
            <a id={id} className={`text-${type} cursor-pointer`}>
                {wrapper}
            </a>
            <Tooltip
                anchorSelect={`#${id}`}
                className={`basic ${type === TooltipType.Error ? "bg-app-error opacity-100" : "bg-app-accent2"}`}
                content={text}
            />
        </div>
    );
}
