import { useContractRead} from 'wagmi'
import {getIcon, getStatusColor, Transaction} from "@/components/App/Transactions/TransactionSteps";
import {useEffect} from "react";
import IdFacet from "@/components/App/Transactions/ThreeVCID.json";
// import {useSession} from "next-auth/react";
import IconError from "@/assets/svg/Error.svg";
import {StakeSteps} from "@/components/App/Offer/InvestModal";

export default function StakeStep({stepProps}) {
    const {amount, offer, stepStake, setStepStake } = stepProps

    // const {data: session} = useSession()
    const session = {} //todo: sesja
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

    useEffect(()=>{
        if(!isEnoughLiquidity) {
            setStepStake(StakeSteps.Skip)
        }
    }, [currentBalance])

    const statuses = (state) => {
        switch (state) {
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
            {state === Transaction.Failed ? <IconError className="w-7 text-gray mr-2"/> : getIcon(state)}

            {stepStake === StakeSteps.Select && <div>
                {statuses(state)}
                {state !== Transaction.Executed && <span className=""> (current:  ${currentBalanceLocale})</span>}
                {state === Transaction.Executed && <div className="flex flex-row gap-5 text-app-error">
                    <div className="hover:underline cursor-pointer" onClick={()=> {setStepStake(StakeSteps.Use)}}>Use stake</div>
                    <div className="hover:underline cursor-pointer" onClick={()=> {setStepStake(StakeSteps.Skip)}}>Invest from wallet</div>
                </div>}
            </div>}

            {stepStake === StakeSteps.Use && <div>
                Investing from Whale ID stake
            </div>}

            {stepStake === StakeSteps.Skip && <div>
                Investment from external wallet
            </div>}
        </div>
    }


    if (isEnoughLiquidity) return prepareRow(Transaction.Executed)
    if (isSuccess && !isEnoughLiquidity) return prepareRow(Transaction.Failed)
    return prepareRow(Transaction.Processing)


}

