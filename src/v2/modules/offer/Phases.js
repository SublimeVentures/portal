import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment";

export default function Phases() {
    const { phases } = usePhaseInvestment();

    return (
        <div className="p-6 rounded bg-[#12202C]">
            <h2>Phases</h2>
            
            <ul className="py-4 flex items-center gap-4">
                {phases.map(({ phase, phaseName }) => (
                    <li key={phase} className="px-2 py-1 text-sm border rounded">
                        {phaseName}
                    </li>
                ))}
            </ul>
        </div>
    );
};
