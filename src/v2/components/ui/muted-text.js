import { cn } from "@/lib/cn";

export default function MutedText({ children, className }) {
    return (
        <p className={cn("text-white/50 text-xs md:text-sm text-center select-none font-light", className)}>
            {children}
        </p>
    );
}
