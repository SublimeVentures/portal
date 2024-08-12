import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Card, CardTitle, CardDescription } from "@/v2/components/ui/card";
import { CheckboxField } from "@/v2/components/ui/checkbox";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { shortenAddress } from "@/v2/lib/helpers";
import { settingsKeys } from "@/v2/constants";
import AddWalletModal from "./AddWalletModal";
import RemoveWalletModal from "./RemoveWalletModal";

export const maxWallets = 3;

export default function WalletSettings({ session }) {
    const { updateEnvironmentProps } = useEnvironmentContext();
    const isDesktop = useMediaQuery(breakpoints.lg);

    const { userId } = session ?? {};

    const { data: wallets, isLoading } = useQuery({
        queryKey: settingsKeys.userWallets(userId),
        queryFn: () => fetchUserWallets(),
        refetchOnWindowFocus: true,
    });

    console.log('wallets', wallets)

    const isMaxWallets = wallets?.length >= maxWallets;

    const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);
    const [isRemoveWalletModalOpen, setIsRemoveWalletModalOpen] = useState(false);

    useEffect(() => {
      updateEnvironmentProps([{ path: "walletGuard", value: false }]);
    }, [isAddWalletModalOpen, isRemoveWalletModalOpen])

    // @todo - add skeleton loading
    if (isLoading) {
        return <div className='text-white'>loading...</div>
    }
    
    return (
        <Card variant="none" className="flex flex-col gap-8 h-full w-full bg-settings-gradient md:py-6 md:px-12">
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="text-lg font-medium">Wallet connect</CardTitle>
                    <CardDescription className="text-md">Payout will be send to this wallet</CardDescription>
                </div>

                <div className="hidden md:block">
                    <AddWalletModal isOpen={isAddWalletModalOpen} setIsOpen={setIsAddWalletModalOpen} isMaxWallets={isMaxWallets} />
                </div>
            </div>

            <ul>
                {wallets?.length ? wallets.map((wallet, idx) => {
                    const address = isDesktop ? wallet.wallet : shortenAddress(wallet.wallet, 10);

                    return (
                      <li className="mb-2 mt-4 py-4 px-8 flex justify-between items-center gap-2 bg-foreground/[.02] rounded">
                        <div className="flex flex-col gap-4">
                            <p className="text-foreground">{address}</p>
                            <div className="flex flex-wrap items-center gap-8">
                              <CheckboxField checked={wallet.isStaking} className="cursor-default pointer-events-none">Staking</CheckboxField>
                              <CheckboxField checked={wallet.isDelegate} className="cursor-default pointer-events-none">Delegated wallet</CheckboxField>
                            </div>
                        </div>

                        {idx > 0 && <RemoveWalletModal wallet={wallet.wallet} isOpen={isRemoveWalletModalOpen} setIsOpen={setIsRemoveWalletModalOpen} />}
                      </li>
                  )}) : null}
            </ul>

            <div className="w-full mt-auto md:hidden">
                <AddWalletModal isOpen={isAddWalletModalOpen} setIsOpen={setIsAddWalletModalOpen} isMaxWallets={isMaxWallets} wallets={wallets} />
            </div>
        </Card>
    );
};
