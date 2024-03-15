import GenericModal from "@/components/Modal/GenericModal";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import Linker from "@/components/link";
import { ExternalLinks } from "@/routes";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { NETWORKS } from "@/lib/utils";
import DynamicIcon from "@/components/Icon";

export default function ChangeNetwork() {
    const { network, account } = useEnvironmentContext();
    const { chains, error, isSupported, isLoading, switchChain } = network;
    const { isConnected } = account;

    const title = () => {
        return (
            <>
                Chain <span className="text-app-error">not supported</span>
            </>
        );
    };

    const content = () => {
        return (
            <div>
                Currently our platform{" "}
                <span className="text-gold">
                    supports {chains?.length} chains
                </span>
                .<br />
                Please switch to one of these to continue.
                <div className="flex flex-col mt-10 gap-5 fullWidth items-center fullWidthButton">
                    {chains?.map((x) => (
                        <UniButton
                            key={x.id}
                            type={ButtonTypes.BASE}
                            handler={() => {
                                if (!isLoading) switchChain({ chainId: x.id });
                            }}
                            text={x.name}
                            isWide={true}
                            zoom={1.05}
                            size={"text-sm sm"}
                            isDisabled={isLoading && !error}
                            icon={
                                <DynamicIcon
                                    name={NETWORKS[x?.id]}
                                    style={ButtonIconSize.hero4}
                                />
                            }
                        />
                    ))}
                </div>
                <div className="text-app-error text-center h-[26px]">
                    {error && error.shortMessage}
                </div>
            </div>
        );
    };

    return (
        <GenericModal
            isOpen={!isSupported && isConnected}
            closeModal={() => {}}
            title={title()}
            content={content()}
            persistent={true}
            noClose={true}
        />
    );
}
