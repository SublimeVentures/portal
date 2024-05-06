import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";

const Tooltip = dynamic(() => import("react-tooltip").then((mod) => mod.Tooltip), { ssr: false });

export const TooltipType = {
    Success: "app-success",
    Primary: "app-gold",
    Error: "app-error",
    Accent: "app-accent2",
};

export function PortalTooltiper({ wrapper, text, type = TooltipType.Primary, className = "", ...rest }) {
    const [id] = useState(() => `component-${Math.random().toString(16).slice(2)}`);
    const [mounted, setMounted] = useState(false)
    const ref = useRef(null);
    
    useEffect(() => {
      ref.current = document.getElementById("portal-root");
      console.log("Portal root:", ref.current); 
      setMounted(true)
    }, [])

    const content = (
        <Tooltip
            anchorSelect={`#${id}`}
            className={`basic z-50 ${type === TooltipType.Error ? "bg-app-error opacity-100" : "bg-app-accent2"}`}
            content={text}
        />
    )

    return (
      <>
          <a id={id} className={cn(`text-${type} cursor-pointer`, className)} {...rest}>{wrapper}</a>
          {(mounted && ref.current) ? createPortal(content, ref.current) : null}
      </>
    )
}
