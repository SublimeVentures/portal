import { Tooltip, TooltipContent, TooltipTrigger } from "@/v2/components/ui/tooltip";
import { cn } from "@/lib/cn";

export default function SinglePhase({ phase, phaseName, phaseDescription, currentPhase }) {
    return (
        <Tooltip>
            <TooltipTrigger
                className={cn(
                    "px-4 py-2 text-sm border-2 rounded",
                    currentPhase === phase
                        ? "text-white bg-primary border-primary"
                        : "text-white/25 border-2 border-white/25",
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
