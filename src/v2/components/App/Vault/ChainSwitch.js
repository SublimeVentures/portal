import { useState } from "react";
import { useSwitchChain } from "wagmi";
import { cn } from "@/lib/cn";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import EthereumIcon from "@/v2/assets/svg/eth.svg";
import PolygonIcon from "@/v2/assets/svg/matic.svg";
import BNBSmartChainIcon from "@/v2/assets/svg/bnb.svg";
import { NetworkEnum } from "@/v2/lib/network";
import ChainsURL from "@/v2/assets/svg/chains.svg?url";

const ICONS = {
    [NetworkEnum.eth]: EthereumIcon,
    [NetworkEnum.bsc]: BNBSmartChainIcon,
    [NetworkEnum.matic]: PolygonIcon,
};

export const ChainIcon = ({ chainId, className, active }) => {
    const Icon = ICONS[chainId] || ICONS[1];
    return (
        <Icon
            className={cn(
                "text-white size-4 transition-transform transition-opacity",
                {
                    "opacity-50 hover:opacity-100 cursor-pointer": !active,
                    "scale-110": active,
                },
                className,
            )}
        />
    );
};

export const ChainButton = ({ children, className, active, invalid, ...props }) => {
    return (
        <button
            className={cn(
                "size-9 rounded-full flex-center outline-none",
                {
                    "bg-gradient-to-t from-[#099FB7] to-[#164062]": active,
                    "bg-[#113651]": !active,
                    "bg-red-800 animate-pulse": invalid,
                },
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
};

const Button = ({ chainId, isActive, children, onClick: onSuccess, className }) => {
    const { switchChain } = useSwitchChain();
    const [hasError, setHasError] = useState(false);
    const onError = () => {
        setHasError(true);
        setTimeout(() => {
            setHasError(false);
        }, 3000);
    };
    return (
        <ChainButton
            active={isActive}
            invalid={hasError}
            className={className}
            onClick={(event) => {
                event.stopPropagation();
                if (isActive) {
                    onSuccess();
                } else {
                    switchChain(
                        {
                            chainId,
                        },
                        {
                            onSuccess,
                            onError,
                        },
                    );
                }
            }}
        >
            {children}
        </ChainButton>
    );
};

export const ChainGroup = ({ children, className }) => {
    return (
        <div
            className={cn(
                "flex items-center gap-5 p-1 rounded-full bg-no-repeat bg-left-top bg-[length:auto_100%]",
                className,
            )}
            style={{ backgroundImage: `url(${ChainsURL})` }}
        >
            {children}
        </div>
    );
};

const ChainSwitch = () => {
    const data = useEnvironmentContext();
    const {
        network: { chains = [], chainId },
    } = data;
    const [open, setOpen] = useState(false);
    return (
        <ChainGroup
            className={cn({
                "w-11": !open,
            })}
        >
            {chains.map((chain) => {
                const isActive = chain.id === chainId;
                return (
                    <Button
                        key={chain.id}
                        isActive={isActive}
                        chainId={chain.id}
                        onClick={() => setOpen((prev) => !prev)}
                        className={cn({
                            "!hidden": !open && !isActive,
                        })}
                    >
                        <ChainIcon chainId={chain.id} active={isActive} />
                    </Button>
                );
            })}
        </ChainGroup>
    );
};

export default ChainSwitch;
