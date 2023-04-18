import {erc20ABI, useContractRead} from 'wagmi'
import {useSession} from "next-auth/react";
import {getIcon, getStatusColor, Transaction} from "@/components/App/Transactions/TransactionSteps";
import {useEffect} from "react";

export default function LiquidityStep({amount, currency, isReady, confirmSuccess}) {
    const {data: session} = useSession()

    const {
        isSuccess,
        data: currentBalance
    } = useContractRead(
        {
            address: currency.address,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [session.user.address],
            watch: true,
        }
    )

    const currentBalanceHuman = (currentBalance ? currentBalance.toNumber() : 0) / 10 ** currency.precision
    const currentBalanceLocale = currentBalanceHuman.toLocaleString()
    const amountLocale = Number(amount).toLocaleString()


    const liquidityHuman = (currentBalance ? currentBalance.toNumber() : 0) / 10 ** currency.precision
    const isEnoughLiquidity = amount < liquidityHuman

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
                return <span className="underline">Wallet doesn't hold {amountLocale} {currency.symbol}</span>
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
                {state !== Transaction.Executed && <div className="text-xs -mt-1">wallet holdings: {currentBalanceLocale} {currency.symbol}</div>}
            </div>
        </div>
    }

    useEffect(()=>{
          if(isEnoughLiquidity && isReady) {
              confirmSuccess()
          }
    }, [currentBalance, isReady])


    if (!isReady) return prepareRow(Transaction.Waiting)
    if (isEnoughLiquidity) return prepareRow(Transaction.Executed)
    if (isSuccess && !isEnoughLiquidity) return prepareRow(Transaction.Failed)
    return prepareRow(Transaction.Processing)


}

