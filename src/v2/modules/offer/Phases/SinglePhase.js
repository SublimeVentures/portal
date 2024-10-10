import { Tooltip, TooltipContent, TooltipTrigger } from "@/v2/components/ui/tooltip";
import { cn } from "@/lib/cn";

export default function SinglePhase({ phase, phaseName, phaseDescription, currentPhase }) {
    return (
        <Tooltip>
            <TooltipTrigger
                className={cn(
                    "px-4 py-2 text-sm border-2 rounded",
                    currentPhase === phase
                        ? "text-foreground bg-primary border-primary"
                        : "text-foreground/25 border-2 border-foreground/25",
                )}
            >
                {phaseName}
            </TooltipTrigger>

            <TooltipContent>
                <p>{phaseDescription}</p>
            </TooltipContent>
        </Tooltip>
    );
}
