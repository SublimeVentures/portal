import FiveChainsIcon from "@/assets/v2/svg/five-chains.svg";
import EthIcon from "@/assets/v2/svg/eth.svg";
import AvaxIcon from "@/assets/v2/svg/avax.svg";
import PolyIcon from "@/assets/v2/svg/poly.svg";
import ConnextIcon from "@/assets/v2/svg/connext.svg";
import BaseIcon from "@/assets/v2/svg/base.svg";
import SingleChain from "./SingleChain";

const activeChain = "eth";

const ChainsList = () => {
    return (
        <div className="relative h-[43px]">
            <FiveChainsIcon className="absolute z-0"  />

            <ul className="relative flex items-center h-full justify-center w-max gap-3">
                {chainList.map(({ name, icon }) => {
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
