import {erc20ABI, useContractRead} from 'wagmi'
import {BigNumber} from "bignumber.js";
import {getIcon, getStatusColor, Transaction} from "@/components/App/BlockchainSteps/config";
import {useEffect, memo} from "react";

const LiquidityStep = memo(({ stepProps }) => {
    const {
        processingData,
        isReady,
        setIsReady,
        isFinished,
        setFinished,
        saveData
    } = stepProps

    const {
        amount,
        userWallet,
        currency,
    } = processingData

    const {
        isSuccess: balanceFed,
        isLoading,
        data: currentBalance
    } = useContractRead(
        {
            address: currency.address,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [userWallet],
            // watch: !isFinished,
            // watch: false,
            // enabled: isReady
            enabled: false,
            cacheOnBlock: true,
        }
    )

    console.log("Liquidity",isReady,!isFinished, balanceFed,isLoading,currentBalance)

    const power = BigNumber(10).pow(currency.precision)
    const currentBalanceBN = BigNumber(currentBalance)
    const currentBalanceHuman = currentBalance ? currentBalanceBN.dividedBy(power).toNumber() : 0
    const isEnoughLiquidity = amount <= currentBalanceHuman

    const currentBalanceLocale = Number(currentBalanceHuman).toLocaleString()
    const amountLocale = Number(amount).toLocaleString()
    console.log("Liquidity=valid", currentBalanceLocale, amountLocale, currentBalance,power,currentBalanceBN,currentBalanceHuman, isEnoughLiquidity)


    useEffect(() => {
        // console.log("Liquidity - watch",isReady, balanceFed, isEnoughLiquidity, currency?.address)

        if (balanceFed && isReady && !isFinished) {
            setFinished(isEnoughLiquidity)
            saveData({
                liquidity: currentBalanceHuman
            })
        }
    }, [isReady, balanceFed, currentBalance, currency?.address, isLoading])


    const statuses = (state) => {
        switch (state) {
            case Transaction.Waiting: {
                return <>Liquidity check</>
            }
            case Transaction.Processing: {
                return <>Checking account funds</>
            }
            case Transaction.Executed: {
                return <>Availability of funds confirmed </>
            }
            case Transaction.Failed: {
                return <span className="underline">Wallet doesn't hold {amountLocale} {currency?.symbol}</span>
            }
            default: {
                return <>Check allowance</>
            }
        }
    }

    const prepareRow = (state) => {
        return <div className={`flex flex-row items-center ${getStatusColor(state)}`}>
            {getIcon(state)}
            <div>
                {statuses(state)}
                {state !== Transaction.Executed && isReady &&
                    <div className="text-xs -mt-1">wallet holdings: {currentBalanceLocale} {currency?.symbol}</div>}
            </div>
        </div>
    }
    if (isFinished && isEnoughLiquidity) return prepareRow(Transaction.Executed)
    if (!isReady) return prepareRow(Transaction.Waiting)
    if (balanceFed && !isEnoughLiquidity) return prepareRow(Transaction.Failed)
    return prepareRow(Transaction.Processing)

}, (prevProps, nextProps) => {
    return (
        prevProps.stepProps.isReady === nextProps.stepProps.isReady &&
        prevProps.stepProps.isFinished === nextProps.stepProps.isFinished
    );
});

export default LiquidityStep;
