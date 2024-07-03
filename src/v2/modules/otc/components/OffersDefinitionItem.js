import { cn } from "@/lib/cn";

export default function OffersDefinitionItem({ term, valueOnly = false, children }) {
    return (
        <>
            <dt className={cn("mt-4 col-span-1 text-md font-light text-foreground", { "sr-only mt-0": valueOnly })}>{term}</dt>
            <dd className={cn("col-span-1 text-lg font-medium text-foreground", { "row-span-2 mt-4": valueOnly })}>{children}</dd>
        </>
    );
};
