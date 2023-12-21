import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

export default function ErrorStep() {
    const { blockchainProps } = useBlockchainContext();
    const {state} = blockchainProps

    const {error: errorNetwork} = state.network
    const {error: errorLiquidity} = state.liquidity
    const {error: errorAllowance} = state.allowance
    const {error: errorTransaction} = state.transaction


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

