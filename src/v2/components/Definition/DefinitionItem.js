import { cn } from "@/lib/cn";

export default function DefinitionItem({ term, className = "", children }) {
    return (
          <>
              <dt className="text-md font-light text-foreground leading-none whitespace-nowrap">{term}</dt>
              <dd className={cn("text-lg font-medium text-foreground leading-none whitespace-nowrap justify-self-end", className)}>{children}</dd>
          </>
    );
};
