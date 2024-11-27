import { useState } from "react";
import StakingSingleSided from "./StakingSingleSided";
import StakingDoubleSided from "./StakingDoubleSided";
import useSingeSidedStaking from "./useSingleSidedStaking";
import useDoubleSidedStaking from "./useDoubleSidedStaking";
import { useTenantSpecificData } from "@/v2/helpers/tenant";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/v2/components/ui/dialog";
import { Button } from "@/v2/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/v2/components/ui/tabs";

const stakingCurrency = {
    chainId: 84532,
    contract: "0xBcf4b6EaD5e44A1FbcF58f8F55906d88290bC1c6",
    isSettlement: true,
    isStaking: true,
    isStore: false,
    name: "Based",
    precision: 18,
    symbol: "BASED",
};

export default function StakingModal({ session, staking = {} }) {
    const { name: tenantName } = useTenantSpecificData();

    // const { currencyStaking, activeCurrencyStaking, account, activeDiamond } = useEnvironmentContext();
    // const { stakeReq, isS1, isStaked, refreshSession } = staking;
    // const stakingCurrency = activeCurrencyStaking?.name ? activeCurrencyStaking : currencyStaking[0];

    const [isOpen, setIsOpen] = useState(false);

    const singleSidedStaking = useSingeSidedStaking({ isOpen, userId: session.userId });
    const doubleSidedStaking = useDoubleSidedStaking({ isOpen, userId: session.userId });
    const isSuccess = singleSidedStaking.transactionSuccessful || doubleSidedStaking.transactionSuccessful;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" aria-label="Open stake modal" onClick={() => setIsOpen(true)}>
                    Stake
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="md:items-center">
                    {isSuccess ? (
                        <>
                            <DialogTitle className="w-full text-center">Staking Successfull</DialogTitle>
                            <DialogDescription className="mb-16 text-center md:text-center">
                                Welcome to <span className="text-success-500">{tenantName}</span>
                            </DialogDescription>
                        </>
                    ) : (
                        <>
                            <DialogTitle className="w-full text-center">Stake Your Tokens</DialogTitle>
                        </>
                    )}
                </DialogHeader>

                <Tabs defaultValue="single-sided">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="single-sided">Single Sided</TabsTrigger>
                        <TabsTrigger value="double-sided">Double Sided</TabsTrigger>
                    </TabsList>
                    <TabsContent value="single-sided">
                        <StakingSingleSided
                            session={session}
                            stakingData={singleSidedStaking}
                            stakingCurrency={stakingCurrency}
                        />
                    </TabsContent>
                    <TabsContent value="double-sided">
                        <StakingDoubleSided
                            session={session}
                            stakingData={doubleSidedStaking}
                            stakingCurrency={stakingCurrency}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
