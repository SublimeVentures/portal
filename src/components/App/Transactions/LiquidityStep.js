import {erc20ABI, useContractRead} from 'wagmi'
import {useSession} from "next-auth/react";
import {getIcon, getStatusColor, Transaction} from "@/components/App/Transactions/TransactionSteps";
import {useEffect} from "react";

export default function LiquidityStep({stepProps}) {
    const {selectedCurrency, isReady, session, amount, isFinished, setFinished} = stepProps

    const {
        isSuccess: balanceFed,
        isIdle,
        isLoading,
        isFetching,
        status,
        data: currentBalance
    } = useContractRead(
        {
            address: selectedCurrency.address,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [session.user.address],
            watch: !isFinished,
            enabled: isReady && selectedCurrency
        }
    )

    const currentBalanceHuman = (currentBalance ? currentBalance.toNumber() : 0) / 10 ** selectedCurrency.precision
    const currentBalanceLocale = currentBalanceHuman.toLocaleString()
    const amountLocale = Number(amount).toLocaleString()

    const liquidityHuman = (currentBalance ? currentBalance.toNumber() : 0) / 10 ** selectedCurrency.precision
    const isEnoughLiquidity = amount < liquidityHuman


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
    }, [isReady, balanceFed, selectedCurrency.symbol])




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
                return <span className="underline">Wallet doesn't hold {amountLocale} {selectedCurrency.symbol}</span>
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
                {state !== Transaction.Executed && isReady && <div className="text-xs -mt-1">wallet holdings: {currentBalanceLocale} {selectedCurrency.symbol}</div>}
            </div>
        </div>
    }

    if (isFinished && isEnoughLiquidity) return prepareRow(Transaction.Executed)
    if (!isReady) return prepareRow(Transaction.Waiting)
    if (balanceFed && !isEnoughLiquidity) return prepareRow(Transaction.Failed)
    return prepareRow(Transaction.Processing)

}

