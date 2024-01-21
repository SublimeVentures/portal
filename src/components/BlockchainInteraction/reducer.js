import React, { memo} from "react";
import useGetTokenBalance from "@/lib/hooks/useGetTokenBalance";


const BlockchainInteraction = ({data}) => {
    const {steps, token} = data

    console.log("BIX",data, token)


    const tokenBalance = useGetTokenBalance(true, token)
    console.log("BIX: tokenBalance",tokenBalance, tokenBalance.balance)




    return (
        <>
            {/*<BlockchchainStep/>*/}
        </>
        // <>
        //     <div className="flex flex-col flex-1 pb-2 justify-content text-sm">
        //         <div className={"h-[50px] w-full flex items-center"}><div className={"w-full h-[1px] bg-outline opacity-30"}></div></div>
        //         {checkNetwork && <NetworkStep/>}
        //         {checkLiquidity && <LiquidityStep/>}
        //         {checkAllowance && <AllowanceStep/>}
        //         <PrerequisiteStep/>
        //         {checkTransaction && <TransactionStep/>}
        //         {/*<ErrorStep/>*/}
        //     </div>
        //     <div className={` pb-5 ${isBased ? "fullWidth" : " w-full fullBtn"}`}>
        //         <InteractStep/>
        //     </div>
    )
}

export default BlockchainInteraction;
