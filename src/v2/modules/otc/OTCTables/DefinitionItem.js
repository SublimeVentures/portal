import { cn } from "@/lib/cn";

export default function DefinitionItem({ term, valueOnly = false, children }) {
    return (
        <>
            <dt className={cn("col-span-1 text-sm font-light text-foreground leading-8", { "sr-only mt-0": valueOnly })}>{term}</dt>
            <dd className={cn("col-span-1 text-md font-medium text-foreground leading-3", { "row-span-2": valueOnly })}>{children}</dd>
        </>
    );
};
