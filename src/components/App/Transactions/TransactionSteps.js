import IconWait from "@/assets/svg/Wait.svg";
import IconLoading from "@/assets/svg/LoadingCustom.svg";
import IconSuccess from "@/assets/svg/Success.svg";
import IconError from "@/assets/svg/Error.svg";
import IdFacet from "@/components/App/Transactions/ThreeVCID.json";
import {ACL as ACLs}  from "@/lib/acl";
import {erc20ABI} from "wagmi";
import { BigNumber } from 'ethers';


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
    const power = BigNumber.from(10).pow(isFromStake ? 6 : currency.precision)
    const _amount = BigNumber.from(amount).mul(power)
    switch (ACL) {
        case ACLs.Whale: {
            console.log("invest function - isFromStake",isFromStake)
            if(isFromStake) {
                return {
                    method:'pledge',
                    args: [
                        nftId,
                        _amount,
                        offer.id,
                    ],
                    address: offer.whale,
                    abi: IdFacet
                }
            } else {
                return {
                    method:'transfer',
                    args: [
                        offer.vault,
                        _amount,
                    ],
                    address: currency.address,
                    abi: erc20ABI
                }
            }
        }
        default: {
            return {
                method:'transfer',
                args: [
                    offer.vault,
                    _amount,
                ],
                address: currency.address,
                abi: erc20ABI
            }
        }
    }
}
