import { useState } from "react";
import Link from "next/link";
import { IoDiamond } from "react-icons/io5";

import { PremiumItemsENUM } from "@/lib/enum/store";
import { routes } from "@/v2/routes";
import { Button } from "@/v2/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/v2/components/ui/dialog";

import SingleUpgrade from "./SingleUpgrade";
import NoUpgrades from "./NoUpgrades";
import UpgradesSkeletonLoader from "./UpgradesSkeletonLoader";
import { useUserPremiumQuery } from "../../../queries";

export default function UpgradesModal() {
    const { data, isLoading } = useUserPremiumQuery();
    const [selectedUpgrade, setSelectedUpgrade] = useState(null);
    
    // Filter to not include Mystery Box - Does this query return it though?
    const filteredData = data?.filter(item => item.id !== PremiumItemsENUM.MysteryBox);
    const noUpgrades = filteredData?.length <= 0;
    const upgradeDisabled = noUpgrades || isLoading || selectedUpgrade === null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="small" variant="outline" className="p-0 w-10 h-10 lg:py-1.5 lg:px-6 lg:w-auto">
                    <span className="hidden lg:inline">Use Upgrades</span>
                    <IoDiamond className="lg:ml-2" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Use Upgrade</DialogTitle>
                </DialogHeader>

                <div>
                    {isLoading ? (
                        <UpgradesSkeletonLoader />
                    ) : (
                        <>
                            <ul className="flex item-center gap-4">
                                {filteredData.map((upgrade) => (
                                    <li key={upgrade.id} className="w-full">
                                        <SingleUpgrade
                                            {...upgrade}
                                            onSelect={(id) => setSelectedUpgrade(id)}
                                            isSelected={selectedUpgrade === upgrade.id}
                                        />
                                    </li>
                                ))}
                            </ul>
                            
                            {noUpgrades && <NoUpgrades />}
                        </>
                    )}
                </div>

                <DialogFooter className="flex items-center">
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" disabled={isLoading}>
                            <Link href={routes.Upgrades}>
                                Buy Upgrades
                            </Link>
                        </Button>
                        
                        <Button disabled={upgradeDisabled}>Use Upgrade</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
