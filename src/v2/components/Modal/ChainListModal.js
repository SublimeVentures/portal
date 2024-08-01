import { useAccount, useSwitchChain } from "wagmi";
// eslint-disable-next-line import/namespace
import * as chains from "wagmi/chains";
import { useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/v2/components/ui/dialog";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { ChainIcon, ChainButton, ChainGroup } from "@/v2/components/App/Vault/ChainSwitch";

const ChainListModal = () => {
    const { isConnected, chainId } = useAccount();
    const { network } = useEnvironmentContext();
    const { chains: current = [], isSupported } = network;
    const isOpen = !isSupported && isConnected;
    const chain = useMemo(() => Object.values(chains).find(({ id }) => id === chainId), [chainId]);
    const { switchChain, error } = useSwitchChain();
    return (
        <Dialog open={isOpen}>
            <DialogContent close={false}>
                <DialogHeader>
                    <DialogTitle className="md:text-center w-full">Chain not supported</DialogTitle>
                    <DialogDescription className="md:text-center w-full">
                        Currently our platform supports {current?.length} chains.
                        <br />
                        Please switch to one of these to continue
                    </DialogDescription>
                </DialogHeader>
                <div className="mx-auto">
                    <div className="flex mx-auto">
                        <ChainGroup className="gap-[26px]">
                            {current.map((chain) => (
                                <ChainButton
                                    key={chain.id}
                                    className="size-14"
                                    onClick={() => switchChain({ chainId: chain.id })}
                                >
                                    <ChainIcon chainId={chain.id} className="size-7" />
                                </ChainButton>
                            ))}
                        </ChainGroup>
                    </div>
                    {error && <p className="text-red-500 text-center w-full mt-3">{error?.shortMessage}</p>}
                </div>
                <p className="text-xxs text-white/[.7] text-center">
                    Current selection: {chain?.name || "Unknown chain"}
                </p>
            </DialogContent>
        </Dialog>
    );
};

export default ChainListModal;
