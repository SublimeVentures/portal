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
import { METHOD } from "@/components/BlockchainSteps/utils";
import { settingsKeys } from "@/v2/constants";

// const stakingCurrency = {
//     chainId: 84532,
//     contract: "0xBcf4b6EaD5e44A1FbcF58f8F55906d88290bC1c6",
//     isSettlement: true,
//     isStaking: true,
//     isStore: false,
//     name: "Based",
//     precision: 18,
//     symbol: "BASED",
// }

const stakingCurrency = {
    chainId: 84532,
    contract: "0x4200000000000000000000000000000000000006",
    isSettlement: true,
    isStaking: true,
    isStore: false,
    name: "WETH",
    precision: 18,
    symbol: "WETH",
};

export default function StakingModal({ userId, staking = {} }) {
    const { name: tenantName, nft } = useTenantSpecificData();
    const { currencyStaking, activeCurrencyStaking, account, activeDiamond } = useEnvironmentContext();
    const { stakeReq, isS1, isStaked, refreshSession } = staking;
    // const stakingCurrency = activeCurrencyStaking?.name ? activeCurrencyStaking : currencyStaking[0];

    // const [stakeSize, setStakeSize] = useState(stakeReq);
    const [isOpen, setIsOpen] = useState(false);
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    useEffect(() => {
        if (transactionSuccessful) {
            refreshSession();
        }
    }, [transactionSuccessful]);

    const { data: wallets } = useQuery({
        queryKey: settingsKeys.userWallets(userId),
        queryFn: () => fetchUserWallets(),
        refetchOnWindowFocus: true,
    });

    const registeredOriginalWallet = wallets?.find((el) => el.isHolder)?.wallet;

    const wallet =
        registeredOriginalWallet === account.address
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
                allowance: stakeReq,
                liquidity: stakeReq,
                buttonText: "Stake",
                contract: activeDiamond,
                spender: activeDiamond,
                delegated: wallet,
                transactionType: METHOD.STAKE,
            },
            token,
            setTransactionSuccessful,
        };
    }, [stakingCurrency?.contract, activeDiamond, stakeReq, isOpen]);

    const { getBlockchainStepsProps, getBlockchainStepButtonProps } = useBlockchainStep({
        data: blockchainInteractionData,
        deps: [isOpen],
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" aria-label="Open stake modal" onClick={() => setIsOpen(true)}>
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
                                Welcome to <span className="text-success-500">{tenantName}</span>
                            </>
                        ) : (
                            <>
                                To partake in <span className="text-success-500">{tenantName}</span> investments, every
                                investor must stake <span className="text-success-500">{stakeReq} $</span> token.
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
                            <dl className="p-6 flex flex-col items-center justify-center h-full bg-transparent border border-white rounded">
                                <dt className="text-white text-lg font-semibold">Detected NFTs</dt>
                                <dd className="mt-2 text-white text-3xl">{nft[isS1 ? 0 : 1]}</dd>
                            </dl>
                            <dl className="p-6 flex flex-col items-center justify-center h-full bg-transparent border border-white rounded">
                                <dt className="text-white text-lg font-semibold">
                                    {isStaked ? "Add" : "Required"} Stake
                                </dt>
                                <dd className="mt-2 text-white text-3xl">
                                    {stakeReq} {stakingCurrency?.name}
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
}
