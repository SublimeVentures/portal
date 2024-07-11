import { cn } from "@/lib/cn";

export default function DefinitionItem({ term, className = "", children }) {
    return (
          <>
              <dt className={cn("text-md font-light text-foreground leading-none whitespace-nowrap", className)}>{term}</dt>
              <dd className="text-lg font-medium text-foreground leading-none whitespace-nowrap justify-self-end">{children}</dd>
          </>
    );
};
