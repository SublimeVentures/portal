import Image from "next/image";

import { useOfferDetailsStore } from "../../../store";
import { getUpgradesData, checkIsUpgradeUsed } from "./utils";
import { cn } from "@/lib/cn";
import { useOfferDetailsQuery } from "@/v2/modules/offer/queries";
import { PremiumItemsENUM } from "@/lib/enum/store";
import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment";

// @TODO - Adjsut images and gradient
export default function SingleUpgrade({ id, amount = 0, isSelected, onSelect }) {
    const { data: offer } = useOfferDetailsQuery();
    const { allocationData, upgradesUse } = useOfferDetailsStore();
    const upgrade = getUpgradesData(id, allocationData, offer.lengthGuaranteed);

    // const { getStoreSrc } = useImage();
    const { phaseCurrent } = usePhaseInvestment();
    const isValidPhase = upgrade.phases.includes(phaseCurrent.phase);
    const { isUsed, usedCount } = checkIsUpgradeUsed(id, upgradesUse);
    const isGuaranteedUpgradeUsed = isUsed && id === PremiumItemsENUM.Guaranteed;

    const handleUpgradeSelect = (id) => {
        if (isValidPhase && amount > 0) onSelect(id);
    };

    return (
        <div
            className={cn(
                "p-2.5 relative h-44 w-full flex gap-4 bg-white/10 border rounded cursor-pointer overflow-hidden transition-all ease-in-out",
                "md:h-[400px] md:max-w-72 md:items-end md:bg-[#0A1C30]",
                isSelected ? "border-primary" : "border-transparent",
                !isValidPhase && amount <= 0 && "cursor-not-allowed",
                !isSelected && isValidPhase && amount > 0 && "hover:border-primary/40",
            )}
            onClick={() => handleUpgradeSelect(id)}
        >
            <div
                className="hidden absolute inset-0 bg-cover bg-center transition-opacity duration-300 md:block"
                style={{ backgroundImage: `url(${upgrade.bg})` }}
            >
                {/*  @TODO: This is gradient - We can get rid of it as soon as guaratneed bg would be updated */}
                <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, transparent 50%, #0A1C30 65%)" }}
                ></div>
            </div>
            <Image
                src={upgrade.bg}
                width="150"
                height="150"
                className="h-full aspect-square shrink-0 object-cover object-top rounded md:hidden"
            />

            <div className="relative flex w-full md:p-4 md:flex-col md:gap-2">
                <div className="w-full flex flex-col">
                    <div className="space-y-2">
                        <h3 className="text-xl text-white">{upgrade.name}</h3>
                        <p className="text-sm font-light text-white md:text-base">
                            {!isValidPhase
                                ? "Can't use this upgrade during this phase."
                                : isGuaranteedUpgradeUsed
                                  ? `${upgrade.name} can be used only once.`
                                  : upgrade.description}
                        </p>
                    </div>
                    <dl
                        className={cn(
                            "mt-auto px-4 py-2 flex items-center gap-x-6 gap-y-2 rounded md:mt-4",
                            isValidPhase ? "text-secondary bg-secondary/10" : "text-red-500 bg-red-500/10",
                        )}
                    >
                        <dt>Owned</dt>
                        <dd style={{ textShadow: isValidPhase ? "0 0 15px #FDC171" : "0 0 15px red" }}>{amount}</dd>

                        {id === PremiumItemsENUM.Increased && isUsed && (
                            <>
                                <dt>Used</dt>
                                <dd style={{ textShadow: isValidPhase ? "0 0 15px green" : "0 0 15px green" }}>
                                    {usedCount}
                                </dd>
                            </>
                        )}
                    </dl>
                </div>
            </div>
        </div>
    );
}
