import moment from "moment";

import SinglePhase from "./SinglePhase";
import PhaseSlider from "./PhaseSlider";
import { cn } from "@/lib/cn";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import Countdown, { defaultUnits } from "@/v2/components/Countdown";
import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment";
import { PhaseId } from "@/v2/lib/phases";

// @TODO
// - Show 'Whale' phase based on value from session - Currently I cannot see matching value in session. Should it be here as a filter or or in v2/hooks/usePhaseTimeline.js
// - What information should tooltip show?
export default function Phases({ className, session }) {
    const isDesktop = useMediaQuery(breakpoints.md);
    const { phases, phaseNext, phaseCurrent, isClosed, updatePhase } = usePhaseInvestment();
    const countStart = moment.unix(phaseNext.startDate).valueOf();

    const phaseList = session.isWhale ? phases : phases.filter((p) => p.phase !== PhaseId.Whale);

    return (
        <div
            className={cn(
                "p-4 flex flex-col items-center justify-between rounded bg-white/[.07] backdrop-blur-3xl 2xl:flex-row",
                className,
            )}
        >
            {isDesktop ? (
                <div className="flex flex-col items-center space-y-4 2xl:flex-row 2xl:space-y-0">
                    <h2 className="text-lg font-semibold 2xl:mr-4 select-none">Phases</h2>
                    <ul className="flex flex-wrap justify-center items-center gap-4">
                        {phaseList.map((phase) => (
                            <li key={phase.phase}>
                                <SinglePhase currentPhase={phaseCurrent.phase} {...phase} />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <PhaseSlider />
            )}

            <div className="mt-4 2xl:mr-16 2xl:mt-0">
                {!isClosed && (
                    <Countdown
                        countStart={countStart}
                        onComplete={updatePhase}
                        units={
                            !isDesktop ? { days: "D . ", hours: "H . ", minutes: "M. ", seconds: "S" } : defaultUnits
                        }
                    />
                )}
                {!isClosed && <p className="mt-2 text-sm text-center md:hidden">Phase duration</p>}
            </div>
        </div>
    );
}
