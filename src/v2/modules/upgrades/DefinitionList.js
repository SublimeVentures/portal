import { cn } from "@/lib/cn";

export function DefinitionTerm({ children }) {
    return <dt className="text-[12px] 3xl:text-md font-light leading-5 self-end">{children}</dt>;
}

export function DefinitionDescription({ children }) {
    return <dd className="text-[14px] 3xl:text-2xl leading-7">{children}</dd>;
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
