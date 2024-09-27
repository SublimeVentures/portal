import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/v2/components/ui/dialog";
import { Button } from "@/v2/components/ui/button";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import { METHOD } from "@/components/BlockchainSteps/utils";
import { settingsKeys } from "@/v2/constants";

export default function UnstakingModal({ userId, staking = {} }) {
    const { currencyStaking, activeCurrencyStaking, account, activeDiamond } = useEnvironmentContext();
    const stakingCurrency = activeCurrencyStaking?.name ? activeCurrencyStaking : currencyStaking[0];
    const { stakeSize } = staking;

    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    const { data: wallets } = useQuery({
        queryKey: settingsKeys.userWallets(userId),
        queryFn: () => fetchUserWallets(),
        refetchOnWindowFocus: true,
    });

    const registeredOriginalWallet = wallets?.find((el) => el.isHolder)?.wallet;
    
    const wallet = registeredOriginalWallet === account.address
        ? "0x0000000000000000000000000000000000000000"
        : registeredOriginalWallet;
    
    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                network: true,
                transaction: true,
            },
            params: {
                requiredNetwork: stakingCurrency.chainId,
                account: account.address,
                buttonText: "Unstake",
                contract: activeDiamond,
                delegated: wallet,
                transactionType: METHOD.UNSTAKE,
            },
            setTransactionSuccessful,
        };
    }, [stakingCurrency?.contract, activeDiamond]);

    const { getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({
        data: blockchainInteractionData,
    });


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" aria-label="Unstake">
                    Unstake
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="md:items-center">
                    <DialogTitle className="w-full text-center">
                        {transactionSuccessful
                            ? `${stakingCurrency?.symbol} unstaked successfully.`
                            : `Unstake ${stakingCurrency?.symbol}`}
                    </DialogTitle>
                    <DialogDescription className="max-w-96 text-center md:text-center">
                        To partake in <span className="text-success-500">BasedVC</span> investments, every investor must
                        stake <span className="text-success-500">$</span> token.
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
                        <dl className="p-6 flex flex-col items-center justify-center h-full bg-transparent border border-foreground rounded">
                            <dt className="text-foreground text-lg font-semibold">Current Stake</dt>
                            <dd className="mt-2 text-foreground text-4xl">
                                {stakeSize} {stakingCurrency?.symbol}
                            </dd>
                        </dl>

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
