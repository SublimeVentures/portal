import { useState } from "react";
import Link from "next/link";
import { IoDiamond } from "react-icons/io5";

import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment"
import { queryClient } from "@/lib/queryCache";
import { useUpgrade } from "@/fetchers/offer.fetcher";
import { PremiumItemsENUM } from "@/lib/enum/store";
import { routes } from "@/v2/routes";
import { Button } from "@/v2/components/ui/button";
import { IconButton } from "@/v2/components/ui/icon-button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/v2/components/ui/dialog";
import { Skeleton } from "@/v2/components/ui/skeleton";

import SingleUpgrade from "./SingleUpgrade";
import EmptyState from "../../../EmptyState";
import { useOfferDetailsQuery, useUserPremiumQuery } from "../../../queries";

export default function UpgradesModal() {
    const { isClosed } = usePhaseInvestment();
    const { data: offer } = useOfferDetailsQuery();
    const { data: upgrade, isLoading } = useUserPremiumQuery();

    const [selectedUpgrade, setSelectedUpgrade] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    
    const filteredData = upgrade?.filter(item => item.id !== PremiumItemsENUM.MysteryBox);
    const isDataAvailable = filteredData?.length > 0;
    const upgradeDisabled = !isDataAvailable || isLoading || selectedUpgrade === null;

    const handleUpgradeUse = async (upgradeId) => {
        if (!upgradeId) return;
        setError(null);
        setIsProcessing(true);

        const res = await useUpgrade(offer.id, upgradeId);

        if (res?.ok) {
            await queryClient.invalidateQueries(["premiumOwned"])
            await queryClient.invalidateQueries(["userAllocation"])
        } else {
            setError(res.error)
        }
        
        setSelectedUpgrade(null);
        setIsProcessing(false);
    };

    const handleSelectUpgrade = (id) => {
        setError(null);
        setSelectedUpgrade(id);
    };

    if (isClosed) {
        return null;
    }

    return (
        <Dialog>
            <DialogTrigger asChild className="hidden lg:inline-flex">
                <Button variant="outline" className="h-10 lg:py-1.5 lg:px-6 lg:w-auto">
                    <IoDiamond className="mr-2" />
                    <span>Use Upgrades</span>
                </Button>
            </DialogTrigger>

            <DialogTrigger asChild className="lg:hidden">
                <IconButton variant="outline" className="p-0" icon={IoDiamond} />
            </DialogTrigger>

            <DialogContent className="md:max-w-max">
                <div className="w-full space-y-8 md:max-w-[750px] xl:max-w-[1200px] 2xl:max-w-[1400px]">
                    <DialogHeader>
                        <DialogTitle>Use Upgrade</DialogTitle>
                    </DialogHeader>

                    <div className="w-full max-h-[368px] overflow-x-hidden overflow-y-auto md:max-h-[400px]">
                        {isLoading && (
                            <div className="h-full w-full flex flex-col items-center gap-4 md:flex-row">
                                <Skeleton className="h-full" count={2} />
                            </div>
                        )}

                        {(isDataAvailable && !isLoading) && (
                            <ul className="flex flex-col items-center justify-center gap-4 md:flex-row md:flex-wrap">
                                {filteredData.map((upgrade) => (
                                    <li key={upgrade.id} className="w-full md:w-auto">
                                        <SingleUpgrade
                                            {...upgrade}
                                            onSelect={handleSelectUpgrade}
                                            isSelected={selectedUpgrade === upgrade.id}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}

                        {!isDataAvailable && (
                            <EmptyState
                                heading="No upgrades yet!"
                                description="It looks like you haven't purchased any upgrades yet. Head over to our Store to explore and unlock powerful enhancements that will boost your experience. Upgrade now and take your performance to the next level!"
                                className="md:px-16 md:py-24"
                            />
                        )}
                
                        {error && <p className="text-lg text-red-500 text-center">{error}</p>}
                    </div>

                    <DialogFooter className="flex items-center">
                        <div className="w-full flex flex-col gap-2 md:flex-row md:items-center md:justify-center">
                            <Button asChild variant="outline" disabled={isLoading || isProcessing}>
                                <Link href={routes.Upgrades}>
                                    Buy Upgrades
                                </Link>
                            </Button>
                            
                            <Button
                                disabled={upgradeDisabled || isProcessing}
                                onClick={() => handleUpgradeUse(selectedUpgrade)}
                            >
                                Use Upgrade
                            </Button>
                        </div>

                        {/* <div className="mx-auto">
                            <Linker url={externalLinks.UPGRADES} />
                        </div> */}
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};
