import IconWait from "@/assets/svg/Wait.svg";
import IconLoading from "@/assets/svg/LoadingCustom.svg";
import IconSuccess from "@/assets/svg/Success.svg";
import IconError from "@/assets/svg/Error.svg";
import InvestFacet from "@/components/App/Transactions/InvestFacet.json";
import IdFacet from "@/components/App/Transactions/ThreeVCID.json";
import {ACL as ACLs}  from "@/lib/acl";

export const Transaction = {
    Waiting: 0,
    Processing: 1,
    Executed: 2,
    Failed: 3,
}



export const getIcon = (status) => {
    switch (status) {
        case Transaction.Waiting: {
            return <IconWait className="w-8 mr-2"/>
        }
        case Transaction.Processing: {
            return <IconLoading className="animate-spin w-7 text-gold mr-2"/>
        }
        case Transaction.Executed: {
            return <IconSuccess className="w-7 text-app-success mr-2"/>
        }
        case Transaction.Failed: {
            return <IconError className="w-7 text-app-error mr-2"/>
        }
    }
}

export const getStatusColor = (status) => {
    switch (status) {
        case Transaction.Waiting: {
            return 'text-gray'
        }
        case Transaction.Processing: {
            return 'text-gold'
        }
        case Transaction.Executed: {
            return 'text-app-success'
        }
        case Transaction.Failed: {
            return 'text-app-error cursor-pointer'
        }
        default: {
            return ''
        }
    }
}


export const getInvestFunction = (ACL, isFromStake, amount, offer, currency, hash, nftId) => {
    console.log("invest function - inside", ACL, ACL.Whale)
    switch (ACL) {
        case ACLs.Whale: {
            console.log("invest function - isFromStake",isFromStake)
            if(isFromStake) {
                return {
                    method:'pledge',
                    args: [
                        nftId,
                        amount * 10 ** currency.precision,
                        offer.id,
                    ],
                    address: offer.whale,
                    abi: IdFacet
                }
            } else {
                return {
                    method:'invest',
                    args: [
                        nftId,
                        amount * 10 ** currency.precision,
                        offer.id,
                        currency.address,
                        hash
                    ],
                    address: offer.diamond,
                    abi: InvestFacet
                }
            }
        }
        default: {
            return {
                method:'investPartner',
                args: [
                    amount * 10 ** currency.precision,
                    offer.id,
                    currency.address,
                    hash
                ],
                address: offer.diamond,
                abi: InvestFacet
            }
        }
    }
}
