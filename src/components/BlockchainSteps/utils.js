import { isAddress } from 'web3-validator';
import {BigNumber} from "bignumber.js";
import {blockchainPrerequisite as prerequisite_otcMakeOffer} from "@/components/App/Otc/MakeOfferModal";
import {blockchainPrerequisite as prerequisite_otcTakeOffer} from "@/components/App/Otc/TakeOfferModal";
import {blockchainPrerequisite as prerequisite_claimPayout} from "@/components/App/Vault/ClaimPayoutModal";
import otcAbi from "../../../abi/otcFacet.abi.json";
import investAbi from "../../../abi/investFacet.abi.json";
import mysteryboxAbi from "../../../abi/MysteryBoxFacet.json";
import upgradeAbi from "../../../abi/UpgradeFacet.json";
import claimAbi from "../../../abi/ClaimFacet.json";
import CitCapStakingAbi from "../../../abi/citcapStaking.abi.json";
import {isBased} from "@/lib/utils";
export const ETH_USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

export const METHOD = {
    NONE: 0,
    INVEST: 1,
    OTC_MAKE: 2,
    OTC_TAKE: 3,
    OTC_CANCEL: 4,
    MYSTERYBOX: 5,
    UPGRADE: 6,
    STAKE: 7,
    UNSTAKE: 8,
    ALLOWANCE:9,
    CLAIM:10
}

const validAddress = (address) => {
    return  typeof address === 'string' && isAddress(address) ;
}
const validHash = (hash) => {
    return typeof hash === 'string' && hash !== '' && hash.length>0;
}
const validToken = (token) => {
    return typeof token ==='string' && isAddress(token.address)
}
const validNumber = (amount) => {
    return typeof amount ==='number' && amount>0
}
const validAllowance = (amount) => {
    return typeof amount ==='number' && amount>=0
}
const validBoolean = (state) => {
    return typeof state ==='boolean'
}
const getTokenInWei = (amount, token) => {
    const power = BigNumber(10).pow(token.precision);
    const result = BigNumber(amount).multipliedBy(power);
    return result.toFixed();
}

export const getMethod = (type, token, params) => {
    switch(type) {
        case METHOD.INVEST: {
            const isValid = validAddress(token?.contract) &&
                validNumber(params?.offerId) &&
                validAddress(params?.spender) &&
                validHash(params?.booking?.code) &&
                validHash(params?.booking?.signature) &&
                validNumber(params?.booking.expires) &&
                validNumber(params?.booking.amount)
            return isValid ? {
                ok:true,
                method: {
                    name: 'invest',
                    inputs: [
                        params.booking.code,
                        params.offerId,
                        params.amount,
                        params.booking.expires,
                        token.contract,
                        params.booking.signature,
                    ],
                    abi: investAbi,
                    confirmations: 2,
                    contract: params.spender
                }
            } : {
                ok: false,
                error: "Validation failed"
            }
        }
        case METHOD.ALLOWANCE: {
            const isValid = validAddress(token?.contract) && validAddress(params?.spender) && validAllowance(params?.allowance)
            const amount = getTokenInWei(params.allowance, token)
            const confirmations = params.chainId === 1 ? 2 : 5
            console.log("METHOD.ALLOWANCE", type, token, params, isValid)

            return isValid ? {
                ok:true,
                method: {
                    name: 'approve',
                    inputs: [params.spender, amount],
                    abi: token.abi,
                    confirmations: confirmations,
                    contract: token.contract
                }
            } : {
                ok:false,
                error: "Validation failed"
            }
        }
        case METHOD.OTC_MAKE: {
            console.log("params.price",params.price.toString())
            const isValid =
                validHash(params.prerequisite?.hash) &&
                validAllowance(params.market.otc) &&
                validNumber(params.price) &&
                validNumber(params.market.otc) &&
                validBoolean(params.isSeller) &&
                validAddress(token?.contract) &&
                validAddress(params?.contract)
            const amount = getTokenInWei(params.price, token)
            console.log("amount",amount)
            return isValid ? {
                ok: true,
                method: {
                    name: 'offerMake',
                    inputs: [
                        params.prerequisite.hash,
                        params.market.otc,
                        amount,
                        token.contract,
                        params.isSeller
                    ],
                    abi: otcAbi,
                    confirmations: 2,
                    contract: params.contract
                }
            } : {
                ok: false,
                error: "Validation failed"
            }
        }
        case METHOD.OTC_CANCEL: {
            const isValid =
                validNumber(params?.otcId) &&
                validNumber(params?.dealId) &&
                validAddress(params?.contract)
            console.log("CHECK PARAMS", params, isValid)
            return isValid ? {
                ok: true,
                method: {
                    name: 'offerCancel',
                    inputs: [
                        params?.otcId,
                        params.dealId,
                    ],
                    abi: otcAbi,
                    confirmations: 2,
                    contract: params.contract
                }
            } : {
                ok: false,
                error: "Validation failed"
            }
        }
        case METHOD.OTC_TAKE: {
            console.log("offerTakeParams", params)

            const isValid =
                validNumber(params?.offerDetails?.otcId) &&
                validNumber(params?.offerDetails?.dealId) &&
                validAddress(params?.contract) &&
                !params?.offerDetails?.isSell ? (
                    validNumber(params?.prerequisite?.signature?.nonce) &&
                    validNumber(params?.prerequisite?.signature?.expiry) &&
                    validHash(params?.prerequisite?.signature?.hash)
                ) : true
            console.log("offerTakeParams isValid", isValid)

            const nonce = params?.prerequisite?.signature?.nonce || 0
            const expiry = params?.prerequisite?.signature?.expiry || 0
            const hash = params?.prerequisite?.signature?.hash || ""
            return isValid ? {
                ok: true,
                method: {
                    name: 'offerTake',
                    inputs: [
                        params.offerDetails.otcId,
                        params.offerDetails.dealId,
                        nonce,
                        expiry,
                        hash,
                    ],
                    abi: otcAbi,
                    confirmations: 2,
                    contract: params.contract
                }
            } : {
                ok: false,
                error: "Validation failed"
            }
        }
        case METHOD.MYSTERYBOX: {
            const isValid =
                validNumber(params?.amount) &&
                validAddress(params?.contract)

            return isValid ? {
                ok: true,
                method: {
                    name: 'buyMysteryBox',
                    inputs: isBased ? [
                        params.amount,
                        token.contract,
                    ] : [
                        params.amount,
                        token.contract,
                        params.tenantId
                    ],
                    abi: mysteryboxAbi,
                    confirmations: 2,
                    contract: params.contract
                }
            } : {
                ok: false,
                error: "Validation failed"
            }
        }
        case METHOD.UPGRADE: {
            const isValid =
                validNumber(params?.amount) &&
                validNumber(params?.upgradeId) &&
                validAddress(params?.contract) &&
                validAddress(token?.contract)

            return isValid ? {
                ok: true,
                method: {
                    name: 'buyUpgrade',
                    inputs: isBased ? [
                        params.amount,
                        params.upgradeId,
                        token.contract,
                    ] : [
                        params.amount,
                        params.upgradeId,
                        token.contract,
                        params.tenantId
                    ],
                    abi: upgradeAbi,
                    confirmations: 2,
                    contract: params.contract
                }
            } : {
                ok: false,
                error: "Validation failed"
            }
        }
        case METHOD.STAKE: {
            const isValid =
                validNumber(params?.allowance) &&
                validNumber(params?.liquidity) &&
                validAddress(params?.contract) &&
                validAddress(token?.contract)

            return isValid ? {
                ok: true,
                method: {
                    name: 'stake',
                    inputs: [],
                    abi: CitCapStakingAbi,
                    confirmations: 2,
                    contract: params.contract
                }
            } : {
                ok: false,
                error: "Validation failed"
            }
        }
        case METHOD.UNSTAKE: {
            const isValid = validAddress(params?.contract)

            return isValid ? {
                ok: true,
                method: {
                    name: 'unstake',
                    inputs: [],
                    abi: CitCapStakingAbi,
                    confirmations: 2,
                    contract: params.contract
                }
            } : {
                ok: false,
                error: "Validation failed"
            }
        }
        case METHOD.CLAIM: {
            const isValid = validAddress(params?.contract) &&
                validHash(params?.prerequisite?.signature) &&
                validNumber(params?.amount) &&
                validNumber(params?.offerId) &&
                validNumber(params?.payoutId) &&
                validNumber(params?.claimId)
            console.log("validation CLAIMER", params, isValid, validHash(params?.prerequisite?.signature))

            return isValid ? {
                ok: true,
                method: {
                    name: 'claimPayout',
                    inputs: [
                        params.offerId,
                        params.payoutId,
                        params.claimId,
                        params.amount,
                        params.prerequisite.signature
                    ],
                    abi: claimAbi,
                    confirmations: 2,
                    contract: params.contract
                }
            } : {
                ok: false,
                error: "Validation failed"
            }
        }
    }
}

export const getPrerequisite = async (type, params) => {
    switch (type) {
        case METHOD.NONE: {
            return {ok: false, method: {}}
        }
        case METHOD.OTC_MAKE: {
            return await prerequisite_otcMakeOffer(params)
        }
        case METHOD.OTC_TAKE: {
            return await prerequisite_otcTakeOffer(params)
        }
        case METHOD.CLAIM: {
            return await prerequisite_claimPayout(params)
        }
        default: {
            return {ok:true, data: {}}
        }
    }

}
