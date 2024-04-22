import { useReconnect } from "wagmi";
import { useEffect } from "react";
import GenericModal from "@/components/Modal/GenericModal";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

export default function ChangeAddress({ session }) {
    const { wallets } = session;
    const { account, environmentCleanup, walletGuard } = useEnvironmentContext();
    const { reconnect } = useReconnect();
    const userAddress = account?.address;

    const isAddressSupported = Boolean(
        walletGuard && userAddress !== undefined && wallets.find((el) => el === userAddress),
    );

    useEffect(() => {
        if (!isAddressSupported) {
            reconnect();
        }
    }, [isAddressSupported, reconnect]);

    const title = () => {
        return (
            <>
                Wallet <span className="text-app-error">error</span>
            </>
        );
    };

    const contentWrongWallet = () => {
        return (
            <div className="flex flex-1 flex-col">
                You've changed the wallet account. <br />
                You can only use wallets approved in the <span className="contents text-app-success">Setting</span>{" "}
                page.
                <div className="my-10">
                    <div className="glowNormal font-bold pb-2 w-full text-center">Unknown Wallet</div>
                    <div className="text-xs p-2 bg-slides text-center bordered-container">{userAddress}</div>
                </div>
                <div className="mt-auto w-full">
                    <div className="w-full fullWidth">
                        <UniButton
                            type={ButtonTypes.BASE}
                            state="danger ml-auto"
                            text="Logout"
                            isWide={true}
                            zoom={1.1}
                            size="text-sm sm"
                            handler={() => {
                                environmentCleanup();
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };
    const contentWalletDisconnected = () => {
        return (
            <div className="flex flex-1 flex-col">
                <p className="pb-5">Your wallet is disconnected.</p>
                <div className="mt-auto w-full">
                    <div className="w-full fullWidth">
                        <UniButton
                            type={ButtonTypes.BASE}
                            state="danger ml-auto"
                            text="Logout"
                            isWide={true}
                            zoom={1.1}
                            size="text-sm sm"
                            handler={() => {
                                environmentCleanup();
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const content = () => (userAddress ? contentWrongWallet() : contentWalletDisconnected());

    return (
        <GenericModal
            isOpen={!isAddressSupported}
            closeModal={() => {}}
            title={title()}
            content={content()}
            persistent={true}
            noClose={true}
        />
    );
}
