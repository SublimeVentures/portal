import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { removeUserWallet } from "@/fetchers/settings.fetcher";
import { Button } from "@/v2/components/ui/button";
import { IconButton } from "@/v2/components/ui/icon-button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/v2/components/ui/dialog";
import CrossIcon from "@/v2/assets/svg/cross.svg";
import { settingsKeys } from "@/v2/constants";

import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { shortenAddress } from "@/v2/lib/helpers";

const STATUS = {
    IDLE: 'IDLE',
    LOADING: 'LOADING',
    FAILURE: 'FAILURE',
    SUCCESS: 'SUCCESS',
};

export default function RemoveWalletModal({ isOpen, setIsOpen, wallet }) {
    const queryClient = useQueryClient();
    const isDesktop = useMediaQuery(breakpoints.lg);
    const address = isDesktop ? wallet : shortenAddress(wallet, 10);
    
    const [status, setStatus] = useState(STATUS.IDLE);
    const [error, setError] = useState(STATUS.IDLE);
    const isSuccess = status === STATUS.SUCCESS;

    const handleRemoveWallet = async () => {
        setStatus(STATUS.LOADING);

        try {
            const result = await removeUserWallet(wallet);

            if (result?.ok) {
                queryClient.invalidateQueries([settingsKeys.wallets]);
                setStatus(STATUS.SUCCESS);
            } else {
                setStatus(STATUS.FAILURE);
                setError(result?.error);
            }
        } catch (err) {
            setStatus(STATUS.FAILURE);
            setError(err.shortMessage);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <>
                    <Button variant="outline" className="hidden md:block" onClick={() => setIsOpen(true)}>Delete wallet</Button>
                    <IconButton name="Delete wallet" shape="circle" variant="outline" icon={CrossIcon} className="w-6 h-6 p-1.5 md:hidden" onClick={() => setIsOpen(true)} />
                </>
            </DialogTrigger>

            <DialogContent handleClose={() => setIsOpen(false)}>
                <DialogHeader>
                    <div className="h-8 w-8 flex items-center justify-center bg-destructive/[.25] text-destructive rounded-full md:hidden">!</div>
                    <DialogTitle>{isSuccess ? "Removed" : "Remove"} wallet</DialogTitle>
                    <DialogDescription>
                        {isSuccess ? "Successfully removed wallet" : "Upon removing a wallet from my account, I acknowledge that it will no longer have access to execute transactions or manage assets on my behalf. This action also frees the wallet for potential association with a different account, under respective authorization norms."}
                    </DialogDescription>
                </DialogHeader>
                
                {!isSuccess ? <div className="py-4 px-8 flex flex-col gap-4 bg-foreground/[.06] text-white text-center rounded">{address}</div> : null}
            
                <DialogFooter>
                    {isSuccess ? (
                      <Button variant="outline" className="md:hidden" onClick={() => setIsOpen(false)}>Close</Button>
                    ) : (
                      <Button variant="destructive" className="md:hidden" onClick={handleRemoveWallet}>Remove wallet</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
