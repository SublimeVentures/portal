import otcAbi from "../../../../abi/otcFacet.abi.json";
import {BigNumber} from "bignumber.js";

export const getOtcMakeFunction = (hash, market, price, currency, isSell, diamond) => {
    const power = BigNumber(10).pow(currency.precision)
    const _price = BigNumber(price).multipliedBy(power)
    return {
        method:'offerMake',
        args: [
            hash,
            market,
            _price,
            currency.address,
            isSell
        ],
        address: diamond,
        abi: otcAbi
    }
}

export const getOtcCancelFunction = (otcId, dealId, diamond) => {
    return {
        method:'offerCancel',
        args: [
            otcId,
            dealId
        ],
        address: diamond,
        abi: otcAbi
    }
}

export const getOtcTakeFunction = (otcId, dealId, nonce, expire, hash, diamond) => {
    return {
        method:'offerTake',
        args: [
            otcId,
            dealId,
            !!nonce ? nonce : 0,
            !!expire ? expire : 0,
            !!hash ? hash : ""
        ],
        address: diamond,
        abi: otcAbi
    }
}

