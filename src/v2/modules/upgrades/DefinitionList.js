import { cn } from "@/lib/cn";

export function DefinitionTerm({ children }) {
    return <dt className="text-xs 3xl:text-sm font-light leading-7 self-end">{children}</dt>;
}

export function DefinitionDescription({ children }) {
    return <dd className="text-sm 3xl:text-lg leading-7 font-medium">{children}</dd>;
}

export function Definition({ children, term }) {
    return (
        <>
            <DefinitionTerm>{term}</DefinitionTerm>
            <DefinitionDescription>{children}</DefinitionDescription>
        </>
    );
}

export default function DefinitionList({ children, className }) {
    return <dl className={cn("grid grid-rows-2 grid-flow-col", className)}>{children}</dl>;
}
