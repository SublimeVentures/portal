import { Tooltip, TooltipContent, TooltipTrigger } from "@/v2/components/ui/tooltip";
import { cn } from "@/lib/cn";

export default function SinglePhase({ phase, phaseName, currentPhase }) {
    return (
        <Tooltip>
            <TooltipTrigger
                className={cn("px-4 py-2 text-sm border rounded", {
                    "bg-primary border-primary": currentPhase === phase
                })}
            >
                {phaseName}
            </TooltipTrigger>
            
            <TooltipContent>
                <p>Hover info</p>
            </TooltipContent>
        </Tooltip>
    );
};
