import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useTenantSpecificData } from "@/v2/helpers/tenant";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import useGetToken from "@/lib/hooks/useGetToken";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/v2/components/ui/dialog";
import { Button } from "@/v2/components/ui/button";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import { fetchUserWallets } from "@/fetchers/settings.fetcher";
import { settingsKeys } from "@/v2/constants";
import { METHOD } from "@/components/BlockchainSteps/utils";

export default function StakingModal({ session = {}, staking = {} }) {
    const { name: tenantName, nft } = useTenantSpecificData();
    const { currencyStaking, activeCurrencyStaking, account, activeDiamond } = useEnvironmentContext();
    const stakingCurrency = activeCurrencyStaking?.name ? activeCurrencyStaking : currencyStaking[0];
    const { stakeReq, isS1, isStaked } = staking;

    const [isOpen, setIsOpen] = useState(false);
    const [stakeSize, setStakeSize] = useState(stakeReq);
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    const { data: wallets } = useQuery({
        queryKey: settingsKeys.userWallets(session.userId),
        queryFn: () => fetchUserWallets(),
        refetchOnWindowFocus: true,
    });

    const registeredOriginalWallet = wallets?.find((el) => el.isHolder)?.wallet;
    
    const wallet = registeredOriginalWallet === account.address
        ? "0x0000000000000000000000000000000000000000"
        : registeredOriginalWallet;
    
    const token = useGetToken(stakingCurrency?.contract);

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                network: true,
                liquidity: true,
                allowance: true,
                transaction: true,
            },
            params: {
                requiredNetwork: stakingCurrency?.chainId,
                account: account.address,
                allowance: stakeSize,
                liquidity: stakeSize,
                buttonText: "Stake",
                contract: activeDiamond,
                spender: activeDiamond,
                delegated: wallet,
                transactionType: METHOD.STAKE,
            },
            token,
            setTransactionSuccessful,
        };
    }, [stakingCurrency?.contract, activeDiamond, stakeSize, isOpen]);

    const { getBlockchainStepsProps, getBlockchainStepButtonProps } = useBlockchainStep({ data: blockchainInteractionData, deps: [isOpen] });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" aria-label="Open stake modal" onClick={() => setIsOpen(true)} >
                    Stake
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="md:items-center">
                    <DialogTitle className="w-full text-center">
                        {transactionSuccessful
                            ? `${stakingCurrency?.name} staked successfully.`
                            : `Stake ${stakingCurrency?.name}`}
                    </DialogTitle>
                    <DialogDescription className="max-w-96 text-center md:text-center">
                        {transactionSuccessful ? (
                            <>
                                Welcome to <span className="text-green-500">{tenantName}</span>
                            </>
                        ) : (
                            <>
                                To partake in <span className="text-green-500">{tenantName}</span> investments, every
                                investor must stake <span className="text-green-500">$</span> token.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {transactionSuccessful ? (
                    <>
                        <DialogFooter className="items-center">
                            <Button className="w-full md:w-64">Close</Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <dl className="p-6 flex flex-col items-center justify-center h-full bg-transparent border border-foreground rounded">
                                <dt className="text-foreground text-lg font-semibold">Detected NFTs</dt>
                                <dd className="mt-2 text-foreground text-4xl">{nft[isS1 ? 0 : 1]}</dd>
                            </dl>
                            <dl className="p-6 flex flex-col items-center justify-center h-full bg-transparent border border-foreground rounded">
                                <dt className="text-foreground text-lg font-semibold">
                                    {isStaked ? "Add" : "Required"} Stake
                                </dt>
                                <dd className="mt-2 text-foreground text-4xl">
                                    {stakeSize} {stakingCurrency?.name}
                                </dd>
                            </dl>
                        </div>

                        <BlockchainSteps {...getBlockchainStepsProps()} />

                        <DialogFooter className="items-center">
                            <BlockchainStepButton className="w-full md:w-64" {...getBlockchainStepButtonProps()} />
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
