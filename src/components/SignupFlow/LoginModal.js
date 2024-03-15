import { ButtonIconSize } from "@/components/Button/RoundButton";
import GenericModal from "@/components/Modal/GenericModal";
import Image from "next/image";
import Linker from "@/components/link";
import { ExternalLinks } from "@/routes";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { isBased } from "@/lib/utils";
import { KNOWN_CONNECTORS } from "@/lib/blockchain";

function getConnectorImage(connectorName) {
    if (KNOWN_CONNECTORS.includes(connectorName)) {
        return `${connectorName}.png`;
    }
    return "wallet.png";
}

export default function LoginModal({ loginModalProps }) {
    const {
        connectors,
        connectorActive,
        connectorIsLoading,
        connect,
        handleConnect,
        modalOpen,
        setModalOpen,
        signErrorMsg,
        setErrorMsg,
        accountIsConnecting,
        isSigningMessage,
        isLoginLoading,
    } = loginModalProps;

    const buttonHandler = async (connector) => {
        setErrorMsg("");
        if (!connectorIsLoading) {
            if (connectorActive) {
                handleConnect();
            } else {
                try {
                    await connect({ connector });
                } catch (error) {
                    setErrorMsg(error.shortMessage);
                }
            }
        }
    };

    const title = () => {
        return <span className={!isBased && `text-app-error`}>Connect Wallet</span>;
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
                                handler={async () => {
                                    await buttonHandler(connector);
                                }}
                                text={connector.name}
                                isWide={true}
                                zoom={1.05}
                                state={"min-w-[300px] mx-auto"}
                                size={"text-sm sm"}
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
            isOpen={modalOpen}
            closeModal={() => {
                setModalOpen(false);
            }}
            title={title()}
            content={content()}
        />
    );
}
