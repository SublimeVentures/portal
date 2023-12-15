import NetworkStep from "@/components/App/BlockchainSteps/NetworkStep";
import LiquidityStep from "@/components/App/BlockchainSteps/LiquidityStep";
import AllowanceStep from "@/components/App/BlockchainSteps/AllowanceStep";
import TransactionStep from "@/components/App/BlockchainSteps/TransactionStep";
import React,  {useState, useEffect, forwardRef,} from "react";
import {isBased} from "@/lib/utils";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";


/******************
 * @devnote
 *     const blockchainProps = {
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

const  BlockchainSteps = forwardRef(({blockchainProps}, ref) => {
// const BlockchainSteps = React.memo(forwardRef(({ blockchainProps }, ref) => {
    const {
        processingData,
        checkNetwork,
        checkLiquidity,
        checkAllowance,
        checkTransaction,
        showButton,
        buttonData,
        saveData,
        saveDataFn
    } = blockchainProps

    const [networkChecked, setNetworkChecked] = useState(false)
    const [networkReady, setNetworkReady] = useState(false)
    const [networkData, setNetworkData] = useState(false)

    const [liquidityChecked, setLiquidityChecked] = useState(false)
    const [liquidityReady, setLiquidityReady] = useState(false)
    const [liquidityData, setLiquidityData] = useState(false)

    const [allowanceChecked, setAllowanceChecked] = useState(false)
    const [allowanceReady, setAllowanceReady] = useState(false)
    const [allowanceData, setAllowanceData] = useState(false)

    const [transactionChecked, setTransactionChecked] = useState(false)
    const [transactionReady, setTransactionReady] = useState(false)
    const [transactionData, setTransactionData] = useState(false)

    console.log("cleanCheck", networkChecked, networkReady, networkData, liquidityChecked, liquidityReady, liquidityData, allowanceChecked, allowanceReady, allowanceData, transactionChecked, transactionReady,transactionData)


    const networkProps = {
        processingData,
        isReady: networkReady,
        setIsReady: setNetworkReady,
        isFinished: networkChecked,
        setFinished: setNetworkChecked,
        saveData: setNetworkData,
    }
    // console.log("networkProps", networkProps)
    // console.log("NetworkStep - check", checkNetwork, networkReady, !networkChecked)

    const liquidityCanRun = liquidityReady && (checkNetwork ? networkChecked : true)
    const liquidityProps = {
        processingData,
        isReady: liquidityCanRun,
        setIsReady: setLiquidityReady,
        isFinished: liquidityChecked,
        setFinished: setLiquidityChecked,
        saveData: setLiquidityData,
    }
    // console.log("liquidityProps", liquidityProps)
    // console.log("LiquidityStep - check", checkLiquidity, liquidityCanRun, liquidityChecked)

    const allowanceCanRun = allowanceReady && (checkNetwork ? networkChecked : true) && (checkLiquidity ? liquidityChecked : true)
    const allowanceProps = {
        processingData,
        isReady: allowanceCanRun,
        setIsReady: setAllowanceReady,
        isFinished: allowanceChecked,
        setFinished: setAllowanceChecked,
        saveData: setAllowanceData,
    }
    // console.log("allowanceProps", allowanceProps)
    // console.log("AllowanceStep - check", checkAllowance, allowanceCanRun, allowanceChecked)


    const transactionCanRun = transactionReady && (checkNetwork ? networkChecked : true) && (checkLiquidity ? liquidityChecked : true) && (checkAllowance ? allowanceChecked : true)
    const transactionProps = {
        processingData,
        isReady: transactionCanRun,
        setIsReady: setTransactionReady,
        isFinished: transactionChecked,
        setFinished: setTransactionChecked,
        saveData: setTransactionData,
    }


    const dataPack = {
        networkData,
        liquidityData,
        allowanceData,
        transactionData,
    }



    const buttonState = () => {
        if(!showButton) return {};

        if(buttonData?.customLock) {
            if(buttonData.customLockParams.length>0) {
                for(let i=0; i<buttonData.customLockParams.length; i++ ){
                    if(buttonData.customLockParams[i].check) {
                        return {
                            text: buttonData.customLockParams[i]?.error ? buttonData.customLockParams[i]?.error : "Processing...",
                            lock: buttonData.customLockParams[i].check
                        }

                    }
                }
            }
        }

        if(checkNetwork && networkReady && !networkChecked) {
            return {
                text: "Processing...",
                lock: true
            }
        }

        if(checkLiquidity && liquidityCanRun && !liquidityChecked) {
            return {
                text: "Not enough liquidity",
                lock: true
            }
        }

        if(checkAllowance && allowanceCanRun && !allowanceChecked) {
            return {
                text: "Processing...",
                lock: true
            }
        }

        if(checkTransaction && transactionCanRun && !transactionChecked) {
            return {
                text: "Processing...",
                lock: true
            }
        }

        return {
            text: buttonData.text,
            lock: false
        }
    }


    const cleanProcess = () => {
        setNetworkChecked(false)
        setNetworkReady(false)
        setNetworkData(false)
        setLiquidityChecked(false)
        setLiquidityReady(false)
        setLiquidityData(false)
        setAllowanceChecked(false)
        setAllowanceReady(false)
        setAllowanceData(false)
        setTransactionChecked(false)
        setTransactionReady(false)
        setTransactionData(false)
    }

    const runProcess = () => {
        // if(buttonState().lock) return;
        if(checkNetwork) {
            setNetworkReady(true)
        }
        if(checkLiquidity) {
            setLiquidityReady(true)
        }
        if(checkAllowance) {
            setAllowanceReady(true)
        }
        if(checkTransaction) {
            setTransactionReady(true)
        }
        // buttonData.buttonFn();
    }

    // useImperativeHandle(ref, () => ({
    //     runProcess,
    // }));

    useEffect(() => {
        if (saveData) {
            saveDataFn({...dataPack, ...{lock: buttonState().lock}})
        }
    }, [networkChecked, networkReady, liquidityChecked, liquidityReady, allowanceChecked, allowanceReady, transactionChecked, transactionReady])



    return (
        <>
            <div className="flex flex-col flex-1 gap-2 pt-5 pb-2 justify-content">

                {checkNetwork && <NetworkStep stepProps={networkProps}/>}
                {checkLiquidity && <LiquidityStep stepProps={liquidityProps}/>}
                {checkAllowance && <AllowanceStep stepProps={allowanceProps}/>}
                {checkTransaction && <TransactionStep stepProps={transactionProps}/>}
            </div>
            {showButton && <div className={` pb-5 ${isBased ? "fullWidth" : "flex flex-1 justify-center"}`}>
                <UniButton
                    type={ButtonTypes.BASE}
                    isWide={true}
                    size={'text-sm sm'}
                    text={buttonState().text}
                    state={"danger"}
                    icon={buttonData.icon}
                    isDisabled={buttonState().lock}
                    handler={() => {
                        buttonData?.buttonFn ? buttonData?.buttonFn() : runProcess()
                    }}/>
            </div>}
        </>
    )
// }))
})

export default BlockchainSteps;
