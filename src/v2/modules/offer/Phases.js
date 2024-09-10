import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/v2/components/ui/tooltip";
import { cn } from "@/lib/cn";

const SinglePhase = ({ phase, phaseName, currentPhase }) => {
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
    )
}

// @TODO 
// - Show 'Whale' phase based on value from session - Currently I cannot see matching value in session. Should it be here as a filter or or in v2/hooks/usePhaseTimeline.js
// - What information should tooltip show?
export default function Phases() {
    const { phases, phaseCurrent } = usePhaseInvestment();

    return (
        <div className="p-4 flex items-center justify-between rounded bg-[#12202C]">
            <div className="flex items-center">
                <h2 className="mr-4 text-lg font-semibold">Phases</h2>
                <ul className="flex items-center gap-4">
                    {phases.map(phase => (
                        <li key={phase.phase}>
                            <SinglePhase currentPhase={phaseCurrent.phase} {...phase} />
                        </li>
                    ))}
                </ul>
            </div>

            <div>Countdown</div>
        </div>
    );
};