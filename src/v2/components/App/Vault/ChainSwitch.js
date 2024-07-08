import { useState } from "react";
import { useSwitchChain } from "wagmi";
import { cn } from "@/lib/cn";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import EthereumIcon from "@/v2/assets/svg/eth.svg";
import PolygonIcon from "@/v2/assets/svg/matic.svg";
import BNBSmartChainIcon from "@/v2/assets/svg/bnb.svg";
import { NetworkEnum } from "@/v2/lib/network";

const url = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.001 43"><path fill="%230d2b3a" d="M233.851 41.574a.774.774 0 0 1-.081-.006c-3.653-.472-11.538-7.053-19.859-7.184a28.778 28.778 0 0 0-11.588 3c-.7.408.112-.046-1.721 1-.747.426-1.966 1.033-3.147 1.6a21.448 21.448 0 0 1-19.877 1.068c-4.01-1.4-11.161-6.763-18.666-6.88a28.786 28.786 0 0 0-11.589 3c-.7.408.113-.046-1.72 1-.431.246-1.02.552-1.667.876a21.448 21.448 0 0 1-20.084 2.518.779.779 0 0 1-.081-.006c-3.654-.472-11.538-7.053-19.859-7.184a28.786 28.786 0 0 0-11.589 3c-.7.408.113-.046-1.721 1-.747.426-1.966 1.033-3.148 1.6A21.32 21.32 0 0 1 76.5 43h-1.249l-.1-.006h-.032l-.264-.018h-.032l-.1-.008h-.036l-.1-.008h-.042l-.089-.008h-.045l-.085-.008h-.047l-.085-.009h-.045l-.089-.01h-.039l-.1-.011h-.034l-.1-.013h-.025q-.264-.034-.526-.074h-.019l-.111-.017h-.025l-.105-.017h-.026l-.105-.018h-.025l-.106-.019h-.024l-.11-.02h-.017l-.12-.023h-.008q-.392-.075-.778-.165h-.012l-.116-.027h-.015l-.114-.131h-.017l-.111-.027h-.017l-.111-.028h-.016l-.116-.03h-.01q-.317-.084-.63-.177l-.019-.006-.1-.031-.031-.01-.09-.028-.037-.011-.081-.042-.04-.013-.08-.026-.044-.014-.075-.025-.047-.015-.071-.024-.051-.017-.065-.022-.056-.019-.05-.018a28.902 28.902 0 0 1-.518-.188l-.108-.041c-.026 0-.053 0-.08-.006-3.653-.471-11.538-7.053-19.858-7.183a28.771 28.771 0 0 0-11.588 3c-.7.408.112-.046-1.721 1-.746.425-1.96 1.03-3.139 1.6A21.486 21.486 0 1 1 21.452 0a21.325 21.325 0 0 1 13.03 4.419l1.071.608c1.833 1.046 1.021.591 1.721 1a28.771 28.771 0 0 0 11.588 3c6.43-.1 12.6-4.054 16.756-6.062q.88-.52 1.813-.957h.007l.228-.105h.011l.224-.1.017-.008.223-.1.017-.007.221-.092.024-.01.219-.088.024-.01.107-.042h.006l.106-.041.027-.01.108-.044.109-.04.028-.01.1-.035.016-.006.1-.037.036-.013.089-.031.019-.007.105-.036.033-.011.091-.031.021-.007.105-.035.034-.011.088-.028L70 1l.1-.033.041-.007.087-.027.026-.008.105-.032.037-.011.083-.025.028-.007.1-.03.041-.012.074-.021.04-.011.1-.027.043-.012.074-.02.038-.01.1-.027.039-.01.079-.02.036-.009.1-.026.049-.009.08-.019.036-.009.106-.025.037-.009.08-.018.041-.008.1-.023.036-.008.083-.018.035-.007.108-.022.038-.008.086-.017.034-.007.109-.021.033-.007.086-.016.033-.006.111-.02.032-.006.088-.015.036-.007.11-.019.032-.005.087-.014.036-.006.111-.017h.031l.089-.013.036-.01.11-.016h.033l.087-.016.038-.005.112-.015h.026l.1-.012h.034l.11-.021h.025l.1-.011h.034L74.3.112h.024l.1-.01h.034l.115-.011h.024l.1-.008h.036l.116-.009h.02l.1-.007h.034l.119-.008h.014l.109-.007h.031l.12-.006h.013l.11-.005h.981a21.331 21.331 0 0 1 13.027 4.376l1.074.611c1.833 1.046 1.021.591 1.721 1a28.785 28.785 0 0 0 11.589 3c6.427-.1 12.593-4.05 16.751-6.06a21.454 21.454 0 0 1 19.3-1.254l.031-.076.8.451a21.42 21.42 0 0 1 2.549 1.443c.83.47 1.655.939 2.265 1.286 1.832 1.046 1.02.591 1.72 1a28.771 28.771 0 0 0 11.589 3c7.5-.117 14.654-5.483 18.665-6.88a21.439 21.439 0 0 1 21.952 2.474l1.074.611c1.832 1.046 1.021.591 1.721 1a28.777 28.777 0 0 0 11.588 3c6.427-.1 12.594-4.05 16.751-6.06A21.486 21.486 0 1 1 241.548 43a21.355 21.355 0 0 1-7.697-1.426Z" data-name="Union 6"/></svg>')`;

const ICONS = {
    [NetworkEnum.eth]: EthereumIcon,
    [NetworkEnum.bsc]: BNBSmartChainIcon,
    [NetworkEnum.matic]: PolygonIcon,
};

const ChainIcon = ({ chainId, className }) => {
    const Icon = ICONS[chainId] || ICONS[1];
    return <Icon className={cn("text-white size-4 transition-transform transition-opacity", className)} />;
};

const ChainButton = ({ chainId, isActive, children, onClick: onSuccess, className }) => {
    const { switchChain } = useSwitchChain();
    const [hasError, setHasError] = useState(false);
    const onError = () => {
        setHasError(true);
        setTimeout(() => {
            setHasError(false);
        }, 3000);
    };
    return (
        <button
            className={cn(
                "size-9 rounded-full flex-center",
                {
                    "bg-gradient-to-t from-[#099FB7] to-[#164062]": isActive,
                    "bg-[#113651]": !isActive,
                    "bg-red-800 animate-pulse": hasError,
                },
                className,
            )}
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
        </button>
    );
};

const ChainSwitch = () => {
    const data = useEnvironmentContext();
    const {
        network: { chains = [], chainId },
    } = data;
    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn("flex items-center gap-5 p-1 rounded-full bg-no-repeat bg-left-top bg-[length:auto_100%]", {
                "w-11": !open,
            })}
            style={{ backgroundImage: url }}
        >
            {chains.map((chain) => {
                const isActive = chain.id === chainId;
                return (
                    <ChainButton
                        key={chain.id}
                        isActive={isActive}
                        chainId={chain.id}
                        onClick={() => setOpen((prev) => !prev)}
                        className={cn({
                            "!hidden": !open && !isActive,
                        })}
                    >
                        <ChainIcon
                            chainId={chain.id}
                            className={cn({
                                "opacity-50 hover:opacity-100 cursor-pointer": !isActive,
                                "scale-110": isActive,
                            })}
                        />
                    </ChainButton>
                );
            })}
        </div>
    );
};

export default ChainSwitch;
