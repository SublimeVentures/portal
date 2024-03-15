import GenericModal from "@/components/Modal/GenericModal";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { isBased } from "@/lib/utils";

export default function ChangeAddress({ session }) {
    const { wallets } = session;
    const { account, environmentCleanup, walletGuard } = useEnvironmentContext();

    const userAddress = account?.address;
    const isAddressSupported = Boolean(
        walletGuard && userAddress !== undefined && wallets.find((el) => el === userAddress),
    );
    console.log("wallet change", userAddress, wallets);

    const title = () => {
        return (
            <>
                Wallet <span className="text-app-error">error</span>
            </>
        );
    };

    const contentWrongWallet = () => {
        return (
            <div className={"flex flex-1 flex-col"}>
                You've changed the wallet account. <br />
                You can only use wallets approved in the <span className={"contents text-app-success"}>
                    Setting
                </span>{" "}
                page.
                <div className={"my-10"}>
                    <div className={"glowNormal font-bold pb-2 w-full text-center"}>Unknown Wallet</div>
                    <div className={`text-xs p-2 bg-slides text-center ${isBased ? "rounded-xl" : ""}`}>
                        {userAddress}
                    </div>
                </div>
                <div className="mt-auto w-full">
                    <div className={" w-full fullWidth"}>
                        <UniButton
                            type={ButtonTypes.BASE}
                            state={"danger ml-auto"}
                            text={"Logout"}
                            isWide={true}
                            zoom={1.1}
                            size={"text-sm sm"}
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
        return <div className={"flex flex-1 flex-col"}>Your wallet is disconnected.</div>;
    };

    const content = () => (!!userAddress ? contentWrongWallet() : contentWalletDisconnected());

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
