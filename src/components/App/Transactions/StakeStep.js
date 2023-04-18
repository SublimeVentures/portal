import { useContractRead} from 'wagmi'
import {getIcon, getStatusColor, Transaction} from "@/components/App/Transactions/TransactionSteps";
import {useEffect} from "react";
import IdFacet from "@/components/App/Transactions/ThreeVCID.json";
import {useSession} from "next-auth/react";
import IconError from "@/assets/svg/Error.svg";
import {useState} from "react";

export default function StakeStep({amount, offer, isReady, confirmSuccess}) {
    const {data: session} = useSession()
    const [useStake, setUseStake] = useState(0)

    const {id} = session.user

    const {
        isSuccess,
        data: currentBalance
    } = useContractRead(
        {
            address: offer.whale,
            abi: IdFacet,
            functionName: 'identityStake',
            args: [id],
        }
    )


    const currentBalanceHuman = (currentBalance ? currentBalance.available.toNumber() : 0) / 10 ** 6
    const currentBalanceLocale = currentBalanceHuman.toLocaleString()
    const amountLocale = Number(amount).toLocaleString()

    const isEnoughLiquidity = (currentBalanceHuman >= amountLocale)


    const statuses = (state) => {
        switch (state) {
            case Transaction.Waiting: {
                return <>Check whale stake</>
            }
            case Transaction.Processing: {
                return <>Checking whale stake</>
            }
            case Transaction.Executed: {
                return <>Staking wallet ready</>
            }
            case Transaction.Failed: {
                return <>NFT stake is too small</>
            }
            default: {
                return <>Check whale stake</>
            }
        }
    }

    const prepareRow = (state) => {
        return <div className={`flex flex-row items-center ${getStatusColor(state=== Transaction.Failed ? Transaction.Waiting : state)}`}>
            {state=== Transaction.Failed ? <IconError className="w-7 text-gray mr-2"/> : getIcon(state)}

            {useStake === 0 && <div>
                {statuses(state)}
                {state !== Transaction.Executed && <span className=" "> (current:  ${currentBalanceLocale})</span>}
                {state === Transaction.Executed && <div className="flex flex-row gap-5 text-app-error">
                    <div className="hover:underline cursor-pointer" onClick={()=> setUseStake(1)}>Use stake</div>
                    <div className="hover:underline cursor-pointer" onClick={()=> setUseStake(2)}>Invest from wallet</div>
                </div>}
            </div>}
            {useStake === 1 && <div>
                Investing from Whale ID stake
            </div>}
            {useStake === 2 && <div>
                Investment from external wallet
            </div>}
        </div>
    }

    useEffect(()=>{
          if(!isEnoughLiquidity) {
              confirmSuccess(2)
          }
    }, [currentBalance])

    useEffect(()=>{
          if(useStake !== 0)  confirmSuccess(useStake)
    }, [useStake])

    if (!isReady) return prepareRow(Transaction.Waiting)
    if (isEnoughLiquidity) return prepareRow(Transaction.Executed)
    if (isSuccess && !isEnoughLiquidity) return prepareRow(Transaction.Failed)
    return prepareRow(Transaction.Processing)


}

