import { useState, useEffect } from "react";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Card, CardTitle, CardDescription } from "@/v2/components/ui/card";
import { AddWalletModal } from "@/v2/components/Modal";
import { Button } from "@/v2/components/ui/button";
import { CheckboxField } from "@/v2/components/ui/checkbox";
import { IconButton } from "@/v2/components/ui/icon-button";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { shortenAddress } from "@/v2/lib/helpers";
import CrossIcon from "@/v2/assets/svg/cross.svg";

export const maxWallets = 3;

// @todo - remove wallet modal
// @todo - add wallet modal
export default function WalletSettings({ wallets }) {
    const { updateEnvironmentProps } = useEnvironmentContext();
    const isDesktop = useMediaQuery(breakpoints.lg);
    const isMaxWallets = wallets.length >= maxWallets;

    const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);
    const [isRemoveWalletModalOpen, setIsRemoveWalletModalOpen] = useState(false);

    useEffect(() => {
        updateEnvironmentProps([{ path: "walletGuard", value: false }]);
    }, [isAddWalletModalOpen, isRemoveWalletModalOpen]);

    return (
        <>
            <Card variant="none" className="flex flex-col gap-8 h-full w-full bg-settings-gradient md:py-6 md:px-12">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-base font-normal md:text-lg font-medium text-white mb-1">
                            Wallet connect
                        </CardTitle>
                        <CardDescription className="text-xs md:text-sm font-light">
                            Payout will be send to this wallet
                        </CardDescription>
                    </div>

                    <div className="hidden md:block">
                        <AddWalletModal isMaxWallets={isMaxWallets} />
                    </div>
                </div>

                <ul>
                    {wallets.map((wallet, idx) => {
                        const address = isDesktop ? wallet.wallet : shortenAddress(wallet.wallet, 10);

                        return (
                            <li
                                className="mb-2 mt-4 py-4 px-8 flex justify-between items-center gap-2 bg-foreground/[.02] rounded"
                                key={address}
                            >
                                <div className="flex flex-col gap-4">
                                    <p className="text-sm md:text-base text-white">{address}</p>
                                    <div className="flex flex-wrap items-center gap-8">
                                        <CheckboxField
                                            checked={wallet.isStaking}
                                            className="cursor-default pointer-events-none"
                                        >
                                            Staking
                                        </CheckboxField>
                                        <CheckboxField
                                            checked={wallet.isDelegate}
                                            className="cursor-default pointer-events-none"
                                        >
                                            Delegated wallet
                                        </CheckboxField>
                                    </div>
                                </div>

                                {idx > 0 && (
                                    <>
                                        <Button variant="outline" className="hidden md:block">
                                            Delete wallet
                                        </Button>
                                        <IconButton
                                            name="Delete wallet"
                                            shape="circle"
                                            variant="outline"
                                            icon={CrossIcon}
                                            className="w-6 h-6 p-1.5 md:hidden"
                                        />
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <div className="w-full mt-auto md:hidden">
                    <AddWalletModal isMaxWallets={isMaxWallets} wallets={wallets} />
                </div>
            </Card>
        </>
    );
}
