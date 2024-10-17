import { useMemo } from "react";

import { useNetworkList } from "./useNetworkList";
import AddWalletForm from "./AddWalletForm";
import { Button } from "@/v2/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/v2/components/ui/dialog";

export default function AddWalletModal({ isOpen, setIsOpen, disabled, wallets }) {
    const { data: networkList = [], isLoading } = useNetworkList();
    const filteredNetworks = useMemo(() => networkList.filter((n) => !n.isSupported), [networkList]);

    if (isLoading) {
        return <div>loading...</div>;
    }

    if (!filteredNetworks.length) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={disabled} onClick={() => setIsOpen(true)} className="w-full">
                    Add wallet
                </Button>
            </DialogTrigger>

            <DialogContent handleClose={() => setIsOpen(false)}>
                <DialogHeader>
                    <div className="h-8 w-8 flex items-center justify-center bg-error/25 text-error rounded-full md:hidden">
                        !
                    </div>
                    <DialogTitle>Add Wallet</DialogTitle>
                    <DialogDescription>Add wallet for airdrop.</DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-center md:justify-start">
                    <div className="hidden h-6 w-6 items-center justify-center bg-error/25 text-error rounded-full md:flex">
                        !
                    </div>
                    <p className="ml-2 text-md font-light text-error text-center md:text-lg md:text-left">
                        Wallet can be assigned only to one account.
                    </p>
                </div>

                <AddWalletForm networkList={filteredNetworks} wallets={wallets} />

                <DialogFooter className="md:hidden">
                    <Button variant="secondary" className="md:hidden" onClick={() => setIsOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
