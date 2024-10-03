import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/cn";
import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment";
import { IconButton } from "@/v2/components/ui/icon-button";

export default function PhaseSlider() {
    const { phases, phaseCurrent } = usePhaseInvestment();
    const currentPhaseIndex = phases.findIndex((phase) => phase.phase === phaseCurrent.phase);
    const [currentIndex, setCurrentIndex] = useState(currentPhaseIndex);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? phases.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === phases.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="w-full flex justify-center items-center space-x-2">
            <IconButton icon={ChevronLeftIcon} onClick={handlePrev} />

            <div className="relative w-full h-full overflow-hidden">
                <ul
                    className="h-full w-full flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentIndex * 50}%)` }}
                >
                    {phases.map(({ phase, phaseName }, idx) => (
                        <li
                            key={phase}
                            className={cn(
                                "mx-[6px] min-w-[calc(50%_-_12px)] h-full flex items-center justify-center shrink-0 text-sm text-center border rounded",
                                {
                                    "bg-primary border-primary": currentPhaseIndex === idx,
                                    "text-foreground/25 border-foreground/25": currentPhaseIndex !== idx,
                                },
                            )}
                        >
                            {phaseName}
                        </li>
                    ))}
                </ul>
            </div>

            <IconButton icon={ChevronRightIcon} onClick={handleNext} />
        </div>
    );
}
