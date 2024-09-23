import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import AddWalletModal from "./AddWalletModal";
import RemoveWalletModal from "./RemoveWalletModal";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Card, CardTitle, CardDescription } from "@/v2/components/ui/card";
import { Badge } from "@/v2/components/ui/badge";
import { CheckboxField } from "@/v2/components/ui/checkbox";
import { Skeleton } from "@/v2/components/ui/skeleton";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { shortenAddress } from "@/v2/lib/helpers";
import { fetchUserWallets } from "@/fetchers/settings.fetcher";
import { settingsKeys } from "@/v2/constants";
import { AIRDROP_NETWORKS } from "@/v2/lib/network";

export const maxWallets = 3;

export default function WalletSettings({ session }) {
    const { updateEnvironmentProps } = useEnvironmentContext();
    const isDesktop = useMediaQuery(breakpoints.lg);

    const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);
    const [isRemoveWalletModalOpen, setIsRemoveWalletModalOpen] = useState(false);

    useEffect(() => {
        updateEnvironmentProps([{ path: "walletGuard", value: false }]);
    }, [isAddWalletModalOpen, isRemoveWalletModalOpen]);

    const { userId } = session ?? {};
    const { data: wallets = [], isLoading } = useQuery({
        queryKey: settingsKeys.userWallets(userId),
        queryFn: () => fetchUserWallets(),
        refetchOnWindowFocus: true,
    });

    const sortedWallets = wallets.sort((a, b) => a.isAirdrop - b.isAirdrop);
    const isMaxWallets = wallets.length >= maxWallets;

    return (
        <Card variant="none" className="flex flex-col gap-8 h-full w-full bg-settings-gradient md:py-6 md:px-12">
            <div className="flex justify-between items-center select-none">
                <div>
                    <CardTitle className="text-lg font-medium">Wallet Connected</CardTitle>
                    <CardDescription className="text-md">Payouts will be sent to this wallet</CardDescription>
                </div>

                <div className="hidden md:block">
                    <AddWalletModal
                        isOpen={isAddWalletModalOpen}
                        setIsOpen={setIsAddWalletModalOpen}
                        disabled={isMaxWallets || isLoading}
                        wallets={wallets}
                    />
                </div>
            </div>

            <div>
                {isLoading ? (
                    <Skeleton count={2} className="mb-4 h-20" />
                ) : (
                    <ul>
                        {sortedWallets?.length
                            ? sortedWallets.map(({ wallet, isStaking, isDelegate, isAirdrop, chainId }) => {
                                  const address = isDesktop ? wallet : shortenAddress(wallet, 10);

                                  return (
                                      <li
                                          key={wallet.wallet}
                                          className="mb-4 py-4 px-8 flex justify-between items-center bg-foreground/[.02] rounded"
                                      >
                                          <div className="flex flex-col gap-4">
                                              <div className="flex items-center gap-2">
                                                  <h4 className="text-foreground">{address}</h4>
                                                  {isAirdrop && (
                                                      <Badge variant="warning">{AIRDROP_NETWORKS[chainId]}</Badge>
                                                  )}
                                              </div>
                                              <div className="flex flex-wrap items-center gap-8">
                                                  <CheckboxField
                                                      checked={isAirdrop}
                                                      className="cursor-default pointer-events-none select-none"
                                                  >
                                                      Airdrop
                                                  </CheckboxField>
                                                  <CheckboxField
                                                      checked={isStaking}
                                                      className="cursor-default pointer-events-none select-none"
                                                  >
                                                      Staking
                                                  </CheckboxField>
                                                  <CheckboxField
                                                      checked={isDelegate}
                                                      className="cursor-default pointer-events-none select-none"
                                                  >
                                                      Delegated Wallet
                                                  </CheckboxField>
                                              </div>
                                          </div>

                                          {isAirdrop && (
                                              <RemoveWalletModal
                                                  wallet={wallet}
                                                  isOpen={isRemoveWalletModalOpen}
                                                  setIsOpen={setIsRemoveWalletModalOpen}
                                              />
                                          )}
                                      </li>
                                  );
                              })
                            : null}
                    </ul>
                )}
            </div>

            <div className="w-full mt-auto md:hidden">
                {!!isLoading && (
                    <AddWalletModal
                        isOpen={isAddWalletModalOpen}
                        setIsOpen={setIsAddWalletModalOpen}
                        isMaxWallets={isMaxWallets}
                        wallets={wallets}
                    />
                )}
            </div>
        </Card>
    );
}
