import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment";
import { PremiumItemsENUM } from "@/lib/enum/store";
import { cn } from "@/lib/cn";

const upgradesData = {
    [PremiumItemsENUM.Guaranteed]: {
        name: "Guaranteed",
        description: "Secure a guaranteed allocation slot.",
        phases: [1, 2, 3, 4, 5, 6, 7, 8],
        bg: "/img/upgrade-dialog-premium.png",
    },
    [PremiumItemsENUM.Increased]: {
        name: "Increased",
        description: "Increase your maximum allocation by $2000.",
        phases: [1, 2, 3, 4, 5, 6, 7, 8],
        bg: "/img/bg/banner/default@2.webp",
    },
};

// @TODO - Make sure what phases can particaular allocations be used in
// @TODO - Adjsut background images and gradient
export default function SingleUpgrade({ id, amount, isSelected, onSelect }) {
    const upgrade = upgradesData[id];
    // const { getStoreSrc } = useImage();

    const { phaseCurrent } = usePhaseInvestment();
    const isValidPhase = upgrade.phases.includes(phaseCurrent.phase);

    return (
        <div
            className={cn(
                "relative flex items-end w-full h-[400px] bg-[#0A1C30] border rounded cursor-pointer overflow-hidden transition-all ease-in-out",
                isSelected ? "border-primary" : "border-transparent",
            )}
            onClick={() => onSelect(id)}
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
                style={{ backgroundImage: `url(${upgrade.bg})` }}
            >
                {/*  @TODO: This is gradient - We can get rid of it as soon as guaratneed bg would be updated */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, #0A1C30 65%)" }}></div>
            </div>
            
            <div className="p-4 relative flex flex-col gap-2">
                <h3 className="text-lg text-foreground">{upgrade.name}</h3>
                <p className="text-base font-light text-foreground">
                    {isValidPhase ? upgrade.description : "Can't use this upgrade during this phase."}
                </p>

                <dl className={cn("px-4 py-2 flex items-center gap-6 rounded", isValidPhase ? "text-accent bg-accent/10" : "text-red-500 bg-red-500/10")}>
                    <dt>Owned</dt>
                    <dd style={{ textShadow: "0 0 15px #FDC171" }}>{amount}</dd>
                </dl>
            </div>
        </div>
    );
};
