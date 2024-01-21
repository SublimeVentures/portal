import React, { memo} from "react";

import NetworkStep from "@/components/App/BlockchainSteps/NetworkStep";
import LiquidityStep from "@/components/App/BlockchainSteps/LiquidityStep";
import AllowanceStep from "@/components/App/BlockchainSteps/AllowanceStep";
import TransactionStep from "@/components/App/BlockchainSteps/TransactionStep";
import ErrorStep from "@/components/App/BlockchainSteps/ErrorStep";
import InteractStep from "@/components/App/BlockchainSteps/InteractStep";

import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

import {isBased} from "@/lib/utils";
import PrerequisiteStep from "@/components/App/BlockchainSteps/PrerequisiteStep";

const BlockchainSteps = () => {
    const {blockchainProps} = useBlockchainContext();
    const {network: checkNetwork, liquidity: checkLiquidity, allowance: checkAllowance, transaction: checkTransaction} = blockchainProps.steps

    return (
        <>
            <div className="flex flex-col flex-1 pb-2 justify-content text-sm">
                <div className={"h-[50px] w-full flex items-center"}><div className={"w-full h-[1px] bg-outline opacity-30"}></div></div>
                {checkNetwork && <NetworkStep/>}
                {checkLiquidity && <LiquidityStep/>}
                {checkAllowance && <AllowanceStep/>}
                <PrerequisiteStep/>
                {checkTransaction && <TransactionStep/>}
                {/*<ErrorStep/>*/}
            </div>
            <div className={` pb-5 ${isBased ? "fullWidth" : " w-full fullBtn"}`}>
                <InteractStep/>
            </div>
        </>
    )
}

const areEqual = (prevProps, nextProps) => {
    return prevProps.blockchainProps?.steps?.network === nextProps.blockchainProps?.steps?.network &&
             prevProps.blockchainProps?.steps?.liquidity === nextProps.blockchainProps?.steps?.liquidity &&
             prevProps.blockchainProps?.steps?.allowance === nextProps.blockchainProps?.steps?.allowance &&
             prevProps.blockchainProps?.steps?.transaction === nextProps.blockchainProps?.steps?.transaction;
};

export default memo(BlockchainSteps, areEqual);
