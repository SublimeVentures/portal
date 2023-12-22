import React, {forwardRef, memo} from "react";

import NetworkStep from "@/components/App/BlockchainSteps/NetworkStep";
import LiquidityStep from "@/components/App/BlockchainSteps/LiquidityStep";
import AllowanceStep from "@/components/App/BlockchainSteps/AllowanceStep";
import TransactionStep from "@/components/App/BlockchainSteps/TransactionStep";
import ErrorStep from "@/components/App/BlockchainSteps/ErrorStep";
import InteractStep from "@/components/App/BlockchainSteps/InteractStep";

import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

import {isBased} from "@/lib/utils";
import PrerequisiteStep from "@/components/App/BlockchainSteps/PrerequisiteStep";

/******************
 * @devnote
 *     const blockchainProps = {
 *         processingData: {                    -/ object with extra data required for each step
 *             requiredChainId: 137,            -/ ONLY: [network]
 *             forcePrecheck: false             -/ ONLY: [network]                              - forces network precheck
 *             amount: 96,                      -/ ONLY: [liquidity]                            - checks for user liquidity
 *             amountAllowance: 96,             -/ ONLY: [allowance]                            - checks for user allowance
 *             userWallet: account.address,     -/ ONLY: [allowance, liquidity, transaction]    - ensures execution from right wallet
 *             currency: selectedCurrency,      -/ ONLY: [allowance, liquidity, transaction]    - currency object to get precision, symbol etc.
 *             diamond: diamond,                -/ ONLY: [allowance]                            - to give proxy permission to charge user
 *             transactionData: otcSellFunction -/ ONLY: [transaction]                          - pass transaction method from `./config.js`
 *         },
 *        buttonData: {                        -/ pass additional button data
 *             buttonFn                        -/ function to run after button triggers
 *             icon                            -/ icon component
 *             text                            -/ button default text
 *             customLock                      -/ enable additional conditions for button disable
 *             customLockParams                -/ enter array of checks and error messages
 *         }
 *         checkNetwork: true,                  -/ enables network check
 *         checkLiquidity: false,               -/ enables liquidity check
 *         checkAllowance: true,                -/ enables allowance check
 *         checkTransaction: true,              -/ enables transaction check/execution
 *         showButton: true,                    -/ enables button to show
 *         saveData: true,                      -/ enable blockchain data to JSON
 *         saveDataFn: setBlockchainData        -/ point setter for saving JSON
 *     }
 ******************/

const BlockchainSteps = () => {
    const {blockchainProps} = useBlockchainContext();
    const {prerequisite: checkPrerequisite, network: checkNetwork, liquidity: checkLiquidity, allowance: checkAllowance, transaction: checkTransaction, button: showButton} = blockchainProps.steps

    return (
        <>
            <div className="flex flex-col flex-1 gap-2 pt-5 pb-2 justify-content text-sm">
                {checkPrerequisite && <PrerequisiteStep/>}
                {checkNetwork && <NetworkStep/>}
                {checkLiquidity && <LiquidityStep/>}
                {checkAllowance && <AllowanceStep/>}
                {checkTransaction && <TransactionStep/>}
                <ErrorStep/>
            </div>

            {showButton && <div className={` pb-5 ${isBased ? "fullWidth" : "flex flex-1 justify-center"}`}>
                <InteractStep/>
            </div>}
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
