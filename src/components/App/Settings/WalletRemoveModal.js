import { useState } from "react";
import { useSignMessage } from "wagmi";
import GenericModal from "@/components/Modal/GenericModal";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { removeUserWallet } from "@/fetchers/settings.fetcher";

export default function WalletRemoveModal({ model, setter, addProps }) {
    const { wallets, refetchUserWallets } = addProps;
    const { account } = useEnvironmentContext();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const existingWallet = wallets.find((el) => el.wallet === account?.address) && !!account?.address;

    const { error: signMessageError, signMessageAsync: signMessageFn } = useSignMessage();

    const closeModal = () => {
        setter();
        setTimeout(() => {
            setSuccess(false);
        }, 400);
    };

    const removeWallet = async () => {
        if (!existingWallet) return;
        setError("");
        setProcessing(true);
        let signature;
        try {
            signature = await signMessageFn({
                account: account?.address,
                message:
                    "Upon removing a wallet from my account, I acknowledge that it will no longer have access to execute transactions or manage assets on my behalf. This action also frees the wallet for potential association with a different account, under respective authorization norms.",
            });
        } catch (error) {
            setProcessing(false);
            setError(error.shortMessage);
            return;
        }

        if (!signature || !!signMessageError) return;
        const result = await removeUserWallet(signature);
        if (result?.ok) {
            refetchUserWallets();
        } else {
            setError(result?.error);
        }
        setSuccess(result?.ok);
        setProcessing(false);
    };

    const title = () => {
        return (
            <>
                <span className="text-app-error">Remove</span> wallet
            </>
        );
    };

    const contentStake = () => {
        return (
            <div className="min-w-[300px]">
                <div>
                    Switch to wallet you want to remove, and sign message.
                    <br />
                    <span className="text-app-error">You need to have at least one wallet assigned!</span>
                </div>
                <div className="py-5">
                    <div className="h-[60px]">
                        {existingWallet && (
                            <div>
                                <div className="glowNormal font-bold pb-2 w-full text-center">Wallet to be removed</div>
                                <div className="text-xs p-2 bg-app-accent2 text-center bordered-container">
                                    {account?.address}
                                </div>
                            </div>
                        )}
                        <div className="pt-2 w-full text-center text-app-error">{error}</div>
                    </div>
                </div>

                <div className="button-container pt-5">
                    <UniButton
                        type={ButtonTypes.BASE}
                        isWide={true}
                        size="text-sm sm"
                        state="danger"
                        isDisabled={!existingWallet}
                        isLoading={processing}
                        text="Remove wallet"
                        handler={async () => {
                            await removeWallet();
                        }}
                    />
                </div>
            </div>
        );
    };

    const contentSuccess = () => {
        return (
            <div className="min-w-[300px]">
                <div className="text-app-success">Wallet removed successfully.</div>
            </div>
        );
    };

    const content = () => {
        return success ? contentSuccess() : contentStake();
    };

    return <GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} />;
}
