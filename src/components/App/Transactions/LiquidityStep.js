import {erc20ABI, useContractRead} from 'wagmi'
import {useSession} from "next-auth/react";
import {getIcon, getStatusColor, Transaction} from "@/components/App/Transactions/TransactionSteps";
import {useEffect} from "react";

export default function LiquidityStep({stepProps}) {
    const {amount, selectedCurrency, setStepLiquidity, stepLiquidityReady, stepLiquidityFinished: stepLiquidity} = stepProps
    const {data: session} = useSession()

    const {
        isSuccess: balanceFed,
        data: currentBalance
    } = useContractRead(
        {
            address: selectedCurrency.address,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [session.user.address],
            watch: true,
            // enabled: stepLiquidityReady
        }
    )



    const currentBalanceHuman = (currentBalance ? currentBalance.toNumber() : 0) / 10 ** selectedCurrency.precision
    const currentBalanceLocale = currentBalanceHuman.toLocaleString()
    const amountLocale = Number(amount).toLocaleString()

    const liquidityHuman = (currentBalance ? currentBalance.toNumber() : 0) / 10 ** selectedCurrency.precision
    const isEnoughLiquidity = amount < liquidityHuman


    useEffect(()=>{
        if(balanceFed && !stepLiquidity && stepLiquidityReady) {
            if(isEnoughLiquidity) {
                setStepLiquidity(true)
            }
        }
    }, [stepLiquidityReady])




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
                {state !== Transaction.Executed && stepLiquidityReady && <div className="text-xs -mt-1">wallet holdings: {currentBalanceLocale} {selectedCurrency.symbol}</div>}
            </div>
        </div>
    }

    if (stepLiquidity) return prepareRow(Transaction.Executed)
    if (!stepLiquidityReady) return prepareRow(Transaction.Waiting)
    if (balanceFed && !isEnoughLiquidity) return prepareRow(Transaction.Failed)
    return prepareRow(Transaction.Processing)

}

