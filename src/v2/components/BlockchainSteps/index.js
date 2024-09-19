import { motion } from "framer-motion";

import { stepsStatus } from "./reducer";
import BlockchainStep from "@/v2/components/BlockchainSteps/BlockchainStep";
import { countSteps } from "@/v2/components/BlockchainSteps/helpers";
import LinkIcon from "@/v2/assets/svg/link.svg";
import BalanceIcon from "@/v2/assets/svg/balance.svg";
import AccountBalanceIcon from "@/v2/assets/svg/account-balance.svg";
import PriorityIcon from "@/v2/assets/svg/priority.svg";
import RocketLaunchIcon from "@/v2/assets/svg/rocket.svg";
import FiveChainsIcon from "@/v2/assets/svg/five-chains.svg";
import FourChainsIcon from "@/v2/assets/svg/four-chains.svg";
import TreeChainsIcon from "@/v2/assets/svg/tree-chains.svg";
import TwoChainsIcon from "@/v2/assets/svg/two-chains.svg";

const successColors = { "--start-color": "rgba(64, 206, 96, .22)", "--end-color": "rgba(32, 103, 48, .22)" };

export const colorSchemes = {
    [stepsStatus.IDLE]: { "--start-color": "rgba(13, 43, 58, .22)", "--end-color": "rgba(165, 210, 255, .22)" },
    [stepsStatus.ERROR]: { "--start-color": "rgba(225, 58, 58, .22)", "--end-color": "rgba(109, 28, 28, .22)" },
    [stepsStatus.PROCESSING]: successColors,
    [stepsStatus.SUCCESS]: successColors,
};

const ChainIcon = ({ steps, status = colorSchemes.IDLE }) => {
    const stepsNumber = countSteps(steps);
    let IconComponent;

    switch (stepsNumber) {
        case 2:
            IconComponent = TwoChainsIcon;
            break;
        case 3:
            IconComponent = TreeChainsIcon;
            break;
        case 4:
            IconComponent = FourChainsIcon;
            break;
        default:
            IconComponent = FiveChainsIcon;
    }

    return <IconComponent style={colorSchemes[status]} className="absolute z-0" />;
};

export default function BlockchainSteps({ content, steps, extraState, status }) {
    return (
        <div className="mb-2 mt-4 py-4 px-8 flex flex-col items-center gap-4 bg-foreground/[.02] rounded">
            <motion.h3
                key={`${content.content}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-base font-medium text-foreground text-center overflow-hidden md:text-lg"
            >
                {content.content}
            </motion.h3>
            <motion.p
                key={`${content.text}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="h-18 text-sm font-light text-foreground text-center overflow-hidden"
            >
                {content.text}
            </motion.p>

            <div className="relative flex justify-center h-[43px]">
                <ChainIcon steps={steps} status={status} />

                <ul className="relative flex items-center h-full justify-center w-max gap-3 overflow-hidden">
                    {steps.network && <BlockchainStep data={extraState.stepNetwork} icon={LinkIcon} />}
                    {steps.liquidity && <BlockchainStep data={extraState.stepLiquidity} icon={BalanceIcon} />}
                    {steps.allowance && <BlockchainStep data={extraState.stepAllowance} icon={AccountBalanceIcon} />}
                    {steps.transaction && <BlockchainStep data={extraState.stepPrerequisite} icon={PriorityIcon} />}
                    {steps.transaction && <BlockchainStep data={extraState.stepTransaction} icon={RocketLaunchIcon} />}
                </ul>
            </div>
        </div>
    );
}
