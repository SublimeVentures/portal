import { stepsStatus } from "./reducer";
import BlockchainStep from "@/v2/components/BlockchainSteps/BlockchainStep";

import LinkIcon from "@/v2/assets/svg/link.svg";
import BalanceIcon from "@/v2/assets/svg/balance.svg";
import AccountBalanceIcon from "@/v2/assets/svg/account-balance.svg";
import PriorityIcon from "@/v2/assets/svg/priority.svg";
import RocketLaunchIcon from "@/v2/assets/svg/rocket.svg";
import FiveChainsIcon from "@/v2/assets/svg/five-chains.svg";

const successColors = {
    "--start-color": "rgba(64, 206, 96, .22)",
    "--end-color": "rgba(32, 103, 48, .22)",
};

const colorSchemes = {
    [stepsStatus.IDLE]: {
        "--start-color": "rgba(13, 43, 58, .22)",
        "--end-color": "rgba(165, 210, 255, .22)",
    },
    [stepsStatus.ERROR]: {
        "--start-color": "rgba(225, 58, 58, .22)",
        "--end-color": "rgba(109, 28, 28, .22)",
    },
    [stepsStatus.PROCESSING]: successColors,
    [stepsStatus.SUCCESS]: successColors,
};

// @TODO
// -> Get description for each step
// -> Get svg from designer for chains with different amount of circles and create dynamic component with it
export default function BlockchainSteps({ status, currentState, steps, extraState }) {
    return (
        <div className="mb-2 mt-4 py-4 px-8 flex flex-col items-center gap-4 bg-foreground/[.02] rounded">
            <h3 className="text-base md:text-lg font-medium text-foreground text-center">{currentState.content}</h3>
            <p className="mb-2 text-sm font-light text-foreground text-center">
                This will guide you through each step for a seamless purchase
            </p>

            <div className="relative h-[43px]">
                <FiveChainsIcon style={colorSchemes[status]} className="absolute z-0" />

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
