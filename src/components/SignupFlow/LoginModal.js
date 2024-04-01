import Image from "next/image";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import GenericModal from "@/components/Modal/GenericModal";
import Linker from "@/components/link";
import { ExternalLinks } from "@/routes";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { getConnectorImage } from "@/components/SignupFlow/helper";

export default function LoginModal({ loginModalProps }) {
    const {
        connectors,
        connectorActive,
        connectorIsLoading,
        connect,
        handleConnect,
        loginModalOpen,
        setLoginModalOpen,
        signErrorMsg,
        setErrorMsg,
        accountIsConnecting,
        isSigningMessage,
        isLoginLoading,
    } = loginModalProps;

    const buttonHandler = (connector) => {
        setErrorMsg("");
        if (connectorIsLoading) return;

        if (connectorActive) {
            handleConnect();
        } else {
            try {
                connect({ connector });
            } catch (error) {
                setErrorMsg(error.shortMessage);
            }
        }
    };

    const content = () => {
        return (
            <>
                <div className="pb-10 font-accent">
                    Don't want to connect your cold wallet? You can delegate access!{" "}
                    <Linker url={ExternalLinks.DELEGATED_ACCESS} />
                </div>
                <div className="flex flex-col gap-5 fullWidth">
                    {connectors
                        .sort((a, b) => {
                            if (a.type === "injected") return -1;
                            if (b.type === "injected") return 1;
                            return 0;
                        })
                        .map((connector) => (
                            <UniButton
                                type={ButtonTypes.BASE}
                                key={connector.id}
                                handler={() => buttonHandler(connector)}
                                text={connector.name}
                                isWide={true}
                                zoom={1.05}
                                state="min-w-[300px] mx-auto"
                                size="text-sm sm"
                                isLoadingWithIcon={true}
                                isDisabled={accountIsConnecting || isSigningMessage || isLoginLoading}
                                icon={
                                    <Image
                                        src={`/img/login/${getConnectorImage(connector.name)}`}
                                        width={32}
                                        height={32}
                                        alt={connector.name}
                                        className={ButtonIconSize.hero}
                                    />
                                }
                            />
                        ))}
                </div>
                <div className="-mb-2 mt-2 text-center text-app-error h-[10px]">
                    {signErrorMsg?.length > 0
                        ? signErrorMsg
                        : accountIsConnecting || isSigningMessage || isLoginLoading
                          ? "Confirm action in wallet"
                          : ""}
                </div>
            </>
        );
    };

    return (
        <GenericModal
            isOpen={loginModalOpen}
            closeModal={() => setLoginModalOpen(false)}
            title={<span className="card-table-header">Connect Wallet</span>}
            content={content()}
        />
    );
}
