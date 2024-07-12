import { useState, useMemo } from "react";

import { Button } from "@/v2/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/v2/components/ui/dialog";
import { useNetworkList } from "./useNetworkList";
import AddWalletForm from "./AddWalletForm";
 
export default function AddWalletModal() {
    const [open, setOpen] = useState(false);

    const { data: networkList = [], isLoading } = useNetworkList();
    const filteredNetwors = useMemo(() => networkList.filter(n => !n.isSupported), [networkList]);

    if (isLoading) {
        return <div>loading...</div>
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>Add</Button>
            </DialogTrigger>

            <DialogContent handleClose={() => setOpen(false)}>
                <DialogHeader>
                    <div className="h-8 w-8 flex items-center justify-center bg-destructive/[.25] text-destructive rounded-full md:hidden">!</div>
                    <DialogTitle>Add Wallet</DialogTitle>
                    <DialogDescription>Add wallet for airdrop.</DialogDescription>
                </DialogHeader>
                
                <div className="flex items-center justify-center md:justify-start">
                    <div className="hidden h-6 w-6 items-center justify-center bg-destructive/[.25] text-destructive rounded-full md:flex">!</div>
                    <p className="ml-2 text-md font-light text-destructive text-center md:text-lg md:text-left">Wallet can be assigned only to one account.</p>
                </div>

                <AddWalletForm networkList={filteredNetwors} />
            
                <DialogFooter>
                    <Button variant="gradient">Add Wallet</Button>
                    <Button variant="secondary" className="md:hidden" onClick={() => setOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
