import { cn } from "@/lib/cn";

export default function DefinitionItem({ term, className = "", children, ddClassName }) {
    return (
        <>
            <dt className={cn("text-xs md:text-sm font-light text-white leading-none whitespace-nowrap", className)}>
                {term}
            </dt>
            <dd
                className={cn(
                    "text-sm font-medium text-white leading-none whitespace-nowrap justify-self-end",
                    ddClassName,
                )}
            >
                {children}
            </dd>
        </>
    );
}
