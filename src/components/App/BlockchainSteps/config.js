import IconWait from "@/assets/svg/Wait.svg";
import IconLoading from "@/assets/svg/LoadingCustom.svg";
import IconSuccess from "@/assets/svg/Success.svg";
import IconError from "@/assets/svg/Error.svg";
import IdFacet from "../../../../abi/ThreeVCID.json";
import CitCapStakingAbi from "../../../../abi/citcapStaking.abi.json";
import upgradeAbi_based from "../../../../abi/upgradeBased.abi.json";
import upgradeAbi_citcap from "../../../../abi/upgradeCitCap.abi.json";
import mysteryBoxAbi_based from "../../../../abi/mysteryboxBased.abi.json";
import mysteryBoxAbi_citcap from "../../../../abi/mysteryboxCitCap.abi.json";
import usdtAbi from "../../../../abi/usdt.abi.json";
import {erc20ABI} from "wagmi";
import {BigNumber} from "bignumber.js";
import {ACLs} from "@/lib/authHelpers";
import {isBased} from "@/lib/utils";

export const Transaction = {
    PrecheckFailed: -1,
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
        case Transaction.PrecheckFailed:
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
        case Transaction.PrecheckFailed:
        case Transaction.Failed: {
            return 'text-app-error cursor-pointer'
        }
        default: {
            return ''
        }
    }
}

export const getInvestFunction = (ACL, isFromStake, amount, offer, currency, hash, nftId) => {
    const power = BigNumber(10).pow(isFromStake ? 6 : currency.precision)
    const _amount = BigNumber(amount).multipliedBy(power)
    switch (ACL) {
        case ACLs.Whale: {
            // console.log("invest function - isFromStake", isFromStake)
            if (isFromStake) {
                return {
                    method: 'pledge',
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
                    method: 'transfer',
                    args: [
                        offer.vault,
                        _amount,
                    ],
                    address: currency.address,
                    abi: currency.symbol === 'USDT' ? usdtAbi : erc20ABI
                }
            }
        }
        default: {
            return {
                method: 'transfer',
                args: [
                    offer.vault,
                    _amount,
                ],
                address: currency.address,
                abi: currency.symbol === 'USDT' ? usdtAbi : erc20ABI
            }
        }
    }
}

export const getCitCapStakingFunction = (contractAddress) => {
    return {
        method: 'stake',
        args: [],
        address: contractAddress,
        abi: CitCapStakingAbi
    }
}

export const getCitCapUnStakingFunction = (contractAddress) => {
    return {
        method: 'unstake',
        args: [],
        address: contractAddress,
        abi: CitCapStakingAbi
    }
}

export const getUpgradesFunction = (contract, currency, amount, itemID) => {
    return {
        method: 'buyUpgrade',
        args: isBased ? [
            amount,
            itemID,
            currency
        ] : [
            amount,
            itemID
        ],
        address: contract,
        abi: isBased ? upgradeAbi_based : upgradeAbi_citcap
    }
}

export const getMysteryBoxFunction = (contract, currency, amount) => {
        return {
            method: 'buyMysteryBox',
            args: isBased ? [
                amount,
                currency
            ] : [
                amount
            ],
            address: contract,
            abi: isBased ? mysteryBoxAbi_based : mysteryBoxAbi_citcap
        }
}

