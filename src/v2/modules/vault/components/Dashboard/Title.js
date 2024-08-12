import { cn } from "@/lib/cn";

export default function Title({ children, subtitle, className }) {
    return (
        <div className={cn("flex flex-row items-center gap-4 md:flex-col md:items-start md:gap-1", className)}>
            <h2 className={cn("text-nowrap text-sm md:text-lg text-white font-medium")}>{children}</h2>
            {subtitle && <p className="text-xs md:text-sm font-light text-white/50">{subtitle}</p>}
        </div>
    );
}
