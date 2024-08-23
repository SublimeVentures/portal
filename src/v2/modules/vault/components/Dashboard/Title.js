import { cn } from "@/lib/cn";

export default function Title({ children, subtitle, className }) {
    return (
        <div className={cn("flex flex-row items-center gap-4 lg:flex-col lg:items-start lg:gap-1", className)}>
            <h2 className={cn("text-nowrap text-sm lg:text-lg text-white font-normal")}>{children}</h2>
            {subtitle && <p className="text-xs lg:text-sm font-light text-white/50">{subtitle}</p>}
        </div>
    );
}
