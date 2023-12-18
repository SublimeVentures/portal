import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

export default function ErrorStep() {
    const {
        networkState,
        liquidityState,
        allowanceState,
        transactionState,
    } = useBlockchainContext();

    const {error: errorNetwork, isError: isErrorNetwork} = networkState
    const {error: errorLiquidity, isError: isErrorLiquidity} = liquidityState
    const {error: errorAllowance, isError: isErrorAllowance} = allowanceState
    const {error: errorTransaction, isError: isErrorTransactions} = transactionState


    return (
        <div className={'fullWidth min-h-[25px]'}>
            {
                (!!errorNetwork || !!errorLiquidity || !!errorAllowance || !!errorTransaction) &&
                <div className={"text-app-error text-center"}>
                    {errorNetwork?.shortMessage ? errorNetwork.shortMessage : errorNetwork?.cause?.reason.toUpperCase()}
                    {errorLiquidity?.shortMessage ? errorLiquidity.shortMessage : errorLiquidity?.cause?.reason.toUpperCase()}
                    {errorAllowance?.shortMessage ? errorAllowance.shortMessage : errorAllowance?.cause?.reason.toUpperCase()}
                    {errorTransaction?.shortMessage ? errorTransaction.shortMessage : errorTransaction?.cause?.reason.errorTransaction.toUpperCase()}
                </div>
            }
        </div>
    )
}

