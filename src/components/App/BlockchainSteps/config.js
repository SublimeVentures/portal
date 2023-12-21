import IconWait from "@/assets/svg/Wait.svg";
import IconLoading from "@/assets/svg/LoadingCustom.svg";
import IconSuccess from "@/assets/svg/Success.svg";
import IconError from "@/assets/svg/Error.svg";
import CitCapStakingAbi from "../../../../abi/citcapStaking.abi.json";
import upgradeAbi_based from "../../../../abi/upgradeBased.abi.json";
import upgradeAbi_citcap from "../../../../abi/upgradeCitCap.abi.json";
import mysteryBoxAbi_based from "../../../../abi/mysteryboxBased.abi.json";
import mysteryBoxAbi_citcap from "../../../../abi/mysteryboxCitCap.abi.json";
import otcAbi from "../../../../abi/otcFacet.abi.json";
import usdtAbi from "../../../../abi/usdt.abi.json";
import {erc20ABI} from "wagmi";
import {BigNumber} from "bignumber.js";
import {isBased} from "@/lib/utils";

export const Transaction = {
    PrecheckFailed: -1,
    Waiting: 0,
    Processing: 1,
    Executed: 2,
    Failed: 3,
}

export const INTERACTION_TYPE = {
    NONE: 0,
    INVEST: 1,
    OTC_MAKE: 2,
    OTC_TAKE: 3,
    OTC_CANCEL: 4,
    MYSTERYBOX: 5,
    UPGRADE: 6,
    STAKE: 7,
    UNSTAKE: 8,
}

export const getTransaction = (type, params) => {
    switch (type) {
        case INTERACTION_TYPE.NONE: {
            return {prerequisites: false, method: {}}
        }
        case INTERACTION_TYPE.INVEST: {
            const {amount, vault, selectedCurrency} = params
            // Check if diamond and hash are non-empty strings
            const isVaultValid = typeof vault === 'string' && vault !== '';

            // Check if price is a number greater than 0
            const isPriceValid = typeof amount === 'number' && amount > 0;

            // Check if selectedCurrency is an object with a non-undefined .address property
            const isSelectedCurrencyValid = selectedCurrency && typeof selectedCurrency.address !== 'undefined';

            const prerequisites = isVaultValid && isPriceValid && isSelectedCurrencyValid
            const method = prerequisites ? getInvestFunction(params) : {}
            return {prerequisites, method}
        }
        case INTERACTION_TYPE.OTC_MAKE: {
            const {diamond, hash, price, selectedCurrency, isSell, market} = params;

            // Check if diamond and hash are non-empty strings
            const isDiamondValid = typeof diamond === 'string' && diamond !== '';
            const isHashValid = typeof hash === 'string' && hash !== '';

            // Check if price is a number greater than 0
            const isPriceValid = typeof price === 'number' && price > 0;

            // Check if selectedCurrency is an object with a non-undefined .address property
            const isSelectedCurrencyValid = selectedCurrency && typeof selectedCurrency.address !== 'undefined';

            // Check if isSell is a boolean
            const isIsSellValid = typeof isSell === 'boolean';

            // Check if market exists
            const isMarketValid = market !== undefined;
            const prerequisites = isDiamondValid && isHashValid && isPriceValid && isSelectedCurrencyValid && isIsSellValid && isMarketValid;
            const method = prerequisites ? getOtcMakeFunction(params) : {}
            return {prerequisites, method}
        }
        case INTERACTION_TYPE.OTC_CANCEL: {
            const {diamond, dealId, otcId} = params;

            // Check if diamond and hash are non-empty strings
            const isDiamondValid = typeof diamond === 'string' && diamond !== '';

            // Check if market exists
            const isOtcIdValid = otcId !== undefined && otcId > 0;
            const isDealIdValid = dealId !== undefined && dealId > 0;

            const prerequisites = isDiamondValid && isOtcIdValid && isDealIdValid;
            const method = prerequisites ? getOtcCancelFunction(params) : {}
            return {prerequisites, method}
        }
        case INTERACTION_TYPE.OTC_TAKE: {
            const {otcId, dealId, signature, diamond} = params;
            let isHashValid = true
            let isNonceValid = true
            let isExpiryValid = true
            if (signature) {
                const {nonce, expiry, hash} = signature;
                isHashValid = typeof hash === 'string' && hash !== '';

                isNonceValid = typeof nonce === 'number';
                isExpiryValid = typeof expiry === 'number';
            }

            // Check if diamond and hash are non-empty strings
            const isDiamondValid = typeof diamond === 'string' && diamond !== '';


            // Check if market exists
            const isOtcIdValid = otcId !== undefined && otcId > 0;
            const isDealIdValid = dealId !== undefined && dealId > 0;

            const prerequisites = isDiamondValid && isOtcIdValid && isDealIdValid && isNonceValid && isExpiryValid && isHashValid;
            const method = prerequisites ? getOtcTakeFunction(params) : {}
            return {prerequisites, method}
        }
        case INTERACTION_TYPE.MYSTERYBOX: {
            const {contract, selectedCurrency, amount} = params;

            const isSelectedCurrencyValid = selectedCurrency && typeof selectedCurrency.address !== 'undefined';
            const isDiamondValid = typeof contract === 'string' && contract !== '';
            const isAmountValid = amount !== undefined && amount > 0;

            const prerequisites = isDiamondValid && isSelectedCurrencyValid && isAmountValid;
            const method = prerequisites ? getMysteryBoxFunction(params) : {}
            return {prerequisites, method}
        }
        case INTERACTION_TYPE.UPGRADE: {
            const {contract, selectedCurrency, amount, upgradeId} = params

            const isSelectedCurrencyValid = selectedCurrency && typeof selectedCurrency.address !== 'undefined';
            const isDiamondValid = typeof contract === 'string' && contract !== '';
            const isAmountValid = amount !== undefined && amount > 0;
            const isUpgradeValid = upgradeId !== undefined && upgradeId >= 0;

            const prerequisites = isDiamondValid && isSelectedCurrencyValid && isAmountValid && isUpgradeValid;
            const method = prerequisites ? getUpgradesFunction(params) : {}
            return {prerequisites, method}
        }
        case INTERACTION_TYPE.STAKE: {
            const {contract} = params

            const isDiamondValid = typeof contract === 'string' && contract !== '';

            const prerequisites = isDiamondValid;
            const method = prerequisites ? getCitCapStakingFunction(params) : {}
            return {prerequisites, method}
        }
        case INTERACTION_TYPE.UNSTAKE: {
            const {contract} = params

            const isDiamondValid = typeof contract === 'string' && contract !== '';

            const prerequisites = isDiamondValid;
            const method = prerequisites ? getCitCapUnStakingFunction(params) : {}
            return {prerequisites, method}
        }
    }
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
            return 'text-app-error'
        }
        default: {
            return ''
        }
    }
}

export const getInvestFunction = (params) => {
    const {amount, vault, selectedCurrency, selectedChain} = params
    const power = BigNumber(10).pow(selectedCurrency.precision)
    const _amount = BigNumber(amount).multipliedBy(power)
    return {
        method: 'transfer',
        args: [
            vault,
            _amount,
        ],
        address: selectedCurrency.address,
        abi: (selectedCurrency.symbol === 'USDT' || selectedChain !== 1) ? usdtAbi : erc20ABI
    }
}

export const getCitCapStakingFunction = (params) => {
    return {
        method: 'stake',
        args: [],
        address: params.contract,
        abi: CitCapStakingAbi
    }
}

export const getCitCapUnStakingFunction = (params) => {
    return {
        method: 'unstake',
        args: [],
        address: params.contract,
        abi: CitCapStakingAbi
    }
}

export const getUpgradesFunction = (params) => {
    const {contract, selectedCurrency, amount, upgradeId} = params

    return {
        method: 'buyUpgrade',
        args: isBased ? [
            amount,
            upgradeId,
            selectedCurrency.address
        ] : [
            amount,
            upgradeId
        ],
        address: contract,
        abi: isBased ? upgradeAbi_based : upgradeAbi_citcap
    }
}

export const getMysteryBoxFunction = (params) => {
    const {contract, selectedCurrency, amount} = params
    return {
        method: 'buyMysteryBox',
        args: isBased ? [
            amount,
            selectedCurrency.address
        ] : [
            amount
        ],
        address: contract,
        abi: isBased ? mysteryBoxAbi_based : mysteryBoxAbi_citcap
    }
}

export const getOtcMakeFunction = (params) => {
    const {hash, market, price, selectedCurrency, isSell, diamond} = params
    const power = BigNumber(10).pow(selectedCurrency.precision)
    const _price = BigNumber(price).multipliedBy(power)
    return {
        method: 'offerMake',
        args: [
            hash,
            market,
            _price,
            selectedCurrency.address,
            isSell
        ],
        address: diamond,
        abi: otcAbi
    }
}

export const getOtcCancelFunction = (params) => {
    const {otcId, dealId, diamond} = params
    return {
        method: 'offerCancel',
        args: [
            otcId,
            dealId
        ],
        address: diamond,
        abi: otcAbi
    }
}

export const getOtcTakeFunction = (params) => {
    const {otcId, dealId, signature, diamond} = params
    let nonce = 0
    let expiry = 0
    let hash = "";
    if (signature) {
        const {nonce: nonceBuy, expiry: expiryBuy, hash: hashBuy} = signature
        nonce = nonceBuy
        expiry = expiryBuy
        hash = hashBuy
    }

    return {
        method: 'offerTake',
        args: [
            otcId,
            dealId,
            !!nonce ? nonce : 0,
            !!expiry ? expiry : 0,
            !!hash ? hash : ""
        ],
        address: diamond,
        abi: otcAbi
    }
}

