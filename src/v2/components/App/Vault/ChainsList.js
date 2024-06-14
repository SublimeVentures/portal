import FiveChainsIcon from "@/v2/assets/svg/five-chains.svg";
import EthIcon from "@/v2/assets/svg/eth.svg";
import AvaxIcon from "@/v2/assets/svg/avax.svg";
import PolyIcon from "@/v2/assets/svg/poly.svg";
import ConnextIcon from "@/v2/assets/svg/connext.svg";
import BaseIcon from "@/v2/assets/svg/base.svg";
import SingleChain from "./SingleChain";

const activeChain = "eth";

const ChainsList = ({ chains = chainList }) => {
    return (
        <div className="relative h-[43px]">
            <FiveChainsIcon className="absolute z-0"  />

            <ul className="relative flex items-center h-full justify-center w-max gap-3">
                {chains.map(({ name, icon }) => {
                    const isChainActive = activeChain === name;

                    return (
                        <li key={name}>
                            <SingleChain icon={icon} active={isChainActive} />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

const chainList = [
    {
        name: "eth",
        icon: EthIcon,
    },
    {
        name: "avax",
        icon: AvaxIcon,
    },
    {
        name: "poly",
        icon: PolyIcon,
    },
    {
        name: "connext",
        icon: ConnextIcon,
    },
    {
        name: "base",
        icon: BaseIcon,
    },
]

export default ChainsList;
