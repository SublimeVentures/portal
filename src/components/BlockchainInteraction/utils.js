import { isAddress } from 'web3-validator';
import {BigNumber} from "bignumber.js";
import {INTERACTION_TYPE} from "@/components/App/BlockchainSteps/config";
import {blockchainPrerequisite as prerequisite_otcMakeOffer} from "@/components/App/Otc/MakeOfferModal";
import otcAbi from "../../../abi/otcFacet.abi.json";
export const ETH_USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7'

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
    ALLOWANCE:9
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
    const power = new BigNumber(10).pow(token.precision)
    return new BigNumber(amount).multipliedBy(power)
}

export const getMethod = (type, token, params) => {
    switch(type) {
        case METHOD.ALLOWANCE: {
            const isValid = validAddress(token?.contract) && validAddress(params?.spender) && validAllowance(params?.allowance)
            const amount = getTokenInWei(params.allowance, token)

            return isValid ? {
                ok:true,
                method: {
                    name: 'approve',
                    inputs: [params.spender, amount],
                    abi: token.abi,
                    confirmations: 1,
                    contract: token.contract
                }
            } : {
                ok:false,
                error: "Validation failed"
            }
        }
        case METHOD.OTC_MAKE: {
            const isValid =
                validHash(params.prerequisite?.hash) &&
                validAllowance(params.market.otc) &&
                validNumber(params.price) &&
                validNumber(params.market.otc) &&
                validBoolean(params.isSeller) &&
                validAddress(token?.contract) &&
                validAddress(params?.contract)
            const amount = getTokenInWei(params.price, token)
            console.log("VALIDATION_HARD", isValid, amount, params)
            return isValid ? {
                ok: true,
                method: {
                    name: 'offerMake',
                    inputs: [
                        params?.prerequisite?.hash,
                        params.market.otc,
                        amount,
                        token.contract,
                        params.isSeller
                    ],
                    abi: token.abi,
                    // abi: otcAbi,
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
        default: {
            return {ok:true, data: {}}
        }
    }

}
