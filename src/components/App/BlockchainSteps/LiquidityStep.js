import {erc20ABI, useContractRead} from 'wagmi'
import { BigNumber } from 'ethers';
import {getIcon, getStatusColor, Transaction} from "@/components/App/BlockchainSteps/config";
import {useEffect} from "react";

export default function LiquidityStep({stepProps}) {
    const {currencyAddress, currencyPrecision, currencySymbol, isReady, account, amount, isFinished, setFinished} = stepProps

    const {
        isSuccess: balanceFed,
        data: currentBalance
    } = useContractRead(
        {
            address: currencyAddress,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [account],
            watch: !isFinished,
            enabled: isReady
        }
    )

    const power = BigNumber.from(10).pow(currencyPrecision)
    const currentBalanceHuman = currentBalance ? currentBalance.div(power).toNumber() : 0
    const isEnoughLiquidity = amount <= currentBalanceHuman

    const currentBalanceLocale = Number(currentBalanceHuman).toLocaleString()
    const amountLocale = Number(amount).toLocaleString()



    // console.log("RECHANGE ===============")
    // console.log("RECHANGE - isEnoughLiquidity",  isEnoughLiquidity,)
    // console.log("RECHANGE - balanceFed", balanceFed)
    // console.log("RECHANGE - isLoading", isLoading)
    // console.log("RECHANGE - isFetching", isFetching)
    // console.log("RECHANGE ===============")

    useEffect(()=>{
        // console.log("RECHANGE EFFECT===============")
        // console.log("RECHANGE EFFECT - isEnoughLiquidity",  isEnoughLiquidity)
        // console.log("RECHANGE EFFECT - balanceFed", balanceFed)
        // console.log("RECHANGE EFFECT - isLoading", isFinished)
        // console.log("RECHANGE EFFECT - isFinished", isReady)
        // console.log("RECHANGE EFFECT===============")
        // console.log("RECHANGE - balanceFed",balanceFed)
        // console.log("RECHANGE- isFinished",!isFinished)
        // console.log("RECHANGE- isReady",isReady)
        // console.log("RECHANGE-isEnoughLiquidity",isEnoughLiquidity)

        if(balanceFed && isReady) {
            setFinished(isEnoughLiquidity)
        }
    }, [isReady, balanceFed, currencyAddress])




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
                return <span className="underline">Wallet doesn't hold {amountLocale} {currencySymbol}</span>
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
                {state !== Transaction.Executed && isReady && <div className="text-xs -mt-1">wallet holdings: {currentBalanceLocale} {currencySymbol}</div>}
            </div>
        </div>
    }
    if (isFinished && isEnoughLiquidity) return prepareRow(Transaction.Executed)
    if (!isReady) return prepareRow(Transaction.Waiting)
    if (balanceFed && !isEnoughLiquidity) return prepareRow(Transaction.Failed)
    return prepareRow(Transaction.Processing)

}

