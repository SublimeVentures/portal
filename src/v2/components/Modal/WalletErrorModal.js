import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useReconnect } from "wagmi";
import { useRouter } from "next/router";
import { Button } from "@/v2/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/v2/components/ui/dialog";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import { routes } from "@/v2/routes";

const WalletErrorModal = ({ session: { wallets = [] } }) => {
    const {
        account: { address },
        environmentCleanup,
    } = useEnvironmentContext();
    const { reconnect } = useReconnect();
    const [isClient, setIsClient] = useState(false);
    const [guard, setGuard] = useState(true);
    const isAddressSupported = wallets.includes(address);
    const isOpen = isClient && (guard || !address) && !isAddressSupported;
    useEffect(() => {
        if (!isAddressSupported) {
            reconnect();
        }
    }, [isAddressSupported, address]);
    const router = useRouter();

    useEffect(() => {
        const showModalOnRoutes = [routes.Settings];
        setIsClient(true);
        setGuard(!showModalOnRoutes.includes(router.pathname));
    }, [router.pathname, setGuard]);
    if (!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen}>
            <DialogContent close={false}>
                <DialogHeader>
                    <DialogTitle>Wallet Error</DialogTitle>
                    {!address ? (
                        <DialogDescription>
                            Your wallet is disconnected. If you're using a crypto extension, check it.
                        </DialogDescription>
                    ) : (
                        <DialogDescription>
                            You've changed the wallet account. You can only use wallets approved in the{" "}
                            <Link
                                href={routes.Settings}
                                className="text-primary inline-flex items-center gap-2 hover:underline hover:underline-offset-4"
                            >
                                settings page
                                <ArrowIcon className="size-1.5 md:size-2.5" />
                            </Link>
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="py-4 px-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-error-900 rounded">
                    {address && (
                        <div className="text-center md:text-left text-error/90">
                            <h3 className="font-medium text-base">Unknown Wallet</h3>
                            <p className="text-xs md:text-sm">{address}</p>
                        </div>
                    )}
                    <Button variant="destructive" onClick={environmentCleanup} className="mx-auto">
                        Logout
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WalletErrorModal;
