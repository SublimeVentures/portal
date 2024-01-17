import CitCapStakingAbi from "../../../../abi/citcapStaking.abi.json";
import upgradeAbi_based from "../../../../abi/upgradeBased.abi.json";
import upgradeAbi_citcap from "../../../../abi/upgradeCitCap.abi.json";
import mysteryBoxAbi_based from "../../../../abi/mysteryboxBased.abi.json";
import mysteryBoxAbi_citcap from "../../../../abi/mysteryboxCitCap.abi.json";
import otcAbi from "../../../../abi/otcFacet.abi.json";
import {BigNumber} from "bignumber.js";
import {isBased} from "@/lib/utils";
import {blockchainPrerequisite as prerequisite_otcMakeOffer} from "@/components/App/Otc/MakeOfferModal";
import {blockchainPrerequisite as prerequisite_otcTakeOffer} from "@/components/App/Otc/TakeOfferModal";
import { motion, AnimatePresence } from 'framer-motion';
import DynamicIcon from "@/components/Icon";
import {ICONS} from "@/lib/icons";
import {Tooltiper, TooltipType} from "@/components/Tooltip";
import {usdtAbi} from "../../../../abi/usdt.abi.js";
import { erc20Abi } from 'viem'

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

export const getPrerequisite = async (type, params) => {
    switch (type) {
        case INTERACTION_TYPE.NONE: {
            return {prerequisites: false, method: {}}
        }
        case INTERACTION_TYPE.INVEST: {
            return {ok:true, data: {}}
        }
        case INTERACTION_TYPE.OTC_MAKE: {
           return await prerequisite_otcMakeOffer(params)
        }
        case INTERACTION_TYPE.OTC_CANCEL: {
           return {ok:true, data: {}}
        }
        case INTERACTION_TYPE.OTC_TAKE: {
           return await prerequisite_otcTakeOffer(params)
        }
        case INTERACTION_TYPE.MYSTERYBOX: {
            return {ok:true, data: {}}
        }
        case INTERACTION_TYPE.UPGRADE: {
            return {ok:true, data: {}}
        }
        case INTERACTION_TYPE.STAKE: {
            return {ok:true, data: {}}
        }
        case INTERACTION_TYPE.UNSTAKE: {
            return {ok:true, data: {}}
        }

    }
}

export const getTransaction = (type, params) => {
    switch (type) {
        case INTERACTION_TYPE.NONE: {
            return {validation: false, method: {}}
        }
        case INTERACTION_TYPE.INVEST: {
            const {liquidity, vault, currencyDetails} = params
            const isVaultValid = typeof vault === 'string' && vault !== '';
            const isPriceValid = typeof liquidity === 'number' && liquidity > 0;
            const isSelectedCurrencyValid = currencyDetails && typeof currencyDetails.address !== 'undefined';
            const validation = isVaultValid && isPriceValid && isSelectedCurrencyValid
            const method = validation ? getInvestFunction(params) : {}
            return {validation, method}
        }
        case INTERACTION_TYPE.OTC_MAKE: {
            const {contract, price, currencyDetails, isSeller, market, hash} = params;
            const isDiamondValid = typeof contract === 'string' && contract !== '';
            const isHashValid = typeof hash === 'string' && hash !== '';
            const isselectedCurrencyValid = currencyDetails && typeof currencyDetails.address !== 'undefined';
            const isMarketValid = market !== undefined ;
            const isIsSellValid = typeof isSeller === 'boolean';
            let isPriceValid
                try{
                    const number = Number(price)
                    isPriceValid = number > 0
                } catch(e){}
            const validation = isDiamondValid && isHashValid && isPriceValid && isselectedCurrencyValid && isIsSellValid && isMarketValid;
            const method = validation ? getOtcMakeFunction(params) : {}
            return {validation, method}
        }
        case INTERACTION_TYPE.OTC_CANCEL: {
            const {contract, dealId, otcId} = params;
            const isDiamondValid = typeof contract === 'string' && contract !== '';
            const isOtcIdValid = otcId !== undefined && otcId > 0;
            const isDealIdValid = dealId !== undefined && dealId > 0;
            const validation = isDiamondValid && isOtcIdValid && isDealIdValid;
            const method = validation ? getOtcCancelFunction(params) : {}
            return {validation, method}
        }
        case INTERACTION_TYPE.OTC_TAKE: {
            const {otcId, dealId, signature, contract} = params;
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
            const isDiamondValid = typeof contract === 'string' && contract !== '';


            // Check if market exists
            const isOtcIdValid = otcId !== undefined && otcId > 0;
            const isDealIdValid = dealId !== undefined && dealId > 0;

            const validation = isDiamondValid && isOtcIdValid && isDealIdValid && isNonceValid && isExpiryValid && isHashValid;
            const method = validation ? getOtcTakeFunction(params) : {}
            return {validation, method}
        }
        case INTERACTION_TYPE.MYSTERYBOX: {
            const {contract, currencyDetails, amount} = params;

            const isSelectedCurrencyValid = currencyDetails && typeof currencyDetails.address !== 'undefined';
            const isDiamondValid = typeof contract === 'string' && contract !== '';
            const isAmountValid = amount !== undefined && amount > 0;

            const validation = isDiamondValid && isSelectedCurrencyValid && isAmountValid;
            const method = validation ? getMysteryBoxFunction(params) : {}
            return {validation, method}
        }
        case INTERACTION_TYPE.UPGRADE: {
            const {contract, currencyDetails, amount, upgradeId} = params
            const isSelectedCurrencyValid = currencyDetails && typeof currencyDetails.address !== 'undefined';
            const isDiamondValid = typeof contract === 'string' && contract !== '';
            const isAmountValid = amount !== undefined && amount > 0;
            const isUpgradeValid = upgradeId !== undefined && upgradeId >= 0;
            const validation = isDiamondValid && isSelectedCurrencyValid && isAmountValid && isUpgradeValid;
            const method = validation ? getUpgradesFunction(params) : {}
            return {validation, method}
        }
        case INTERACTION_TYPE.STAKE: {
            const {contract} = params

            const isDiamondValid = typeof contract === 'string' && contract !== '';

            const validation = isDiamondValid;
            const method = validation ? getCitCapStakingFunction(params) : {}
            return {validation, method}
        }
        case INTERACTION_TYPE.UNSTAKE: {
            const {contract} = params

            const isDiamondValid = typeof contract === 'string' && contract !== '';

            const validation = isDiamondValid;
            const method = validation ? getCitCapUnStakingFunction(params) : {}
            return {validation, method}
        }
    }
}


export const getInvestFunction = (params) => {
    const {liquidity, vault, currencyDetails, chainId} = params
    const power = BigNumber(10).pow(currencyDetails.precision)
    const _amount = BigNumber(liquidity).multipliedBy(power)
    return {
        method: 'transfer',
        args: [
            vault,
            _amount,
        ],
        address: currencyDetails.address,
        abi: (currencyDetails.symbol === 'USDT' && chainId === 1) ? usdtAbi : erc20Abi
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
    const {contract, currencyDetails, amount, upgradeId} = params

    return {
        method: 'buyUpgrade',
        args: isBased ? [
            amount,
            upgradeId,
            currencyDetails.address
        ] : [
            amount,
            upgradeId
        ],
        address: contract,
        abi: isBased ? upgradeAbi_based : upgradeAbi_citcap
    }
}

export const getMysteryBoxFunction = (params) => {
    const {contract, currencyDetails, amount} = params
    return {
        method: 'buyMysteryBox',
        args: isBased ? [
            amount,
            currencyDetails.address
        ] : [
            amount
        ],
        address: contract,
        abi: isBased ? mysteryBoxAbi_based : mysteryBoxAbi_citcap
    }
}

export const getOtcMakeFunction = (params) => {
    const {contract, price, currencyDetails, isSeller, market, hash} = params;
    console.log("getOtcMakeFunction params", params)
    const power = new BigNumber(10).pow(currencyDetails.precision)
    const _price = new BigNumber(price).multipliedBy(power)
    return {
        method: 'offerMake',
        args: [
            hash,
            market.otc,
            _price.toFixed(0),
            currencyDetails.address,
            isSeller
        ],
        address: contract,
        abi: otcAbi
    }
}

export const getOtcCancelFunction = (params) => {
    const {otcId, dealId, contract} = params
    return {
        method: 'offerCancel',
        args: [
            otcId,
            dealId
        ],
        address: contract,
        abi: otcAbi
    }
}

export const getOtcTakeFunction = (params) => {
    const {otcId, dealId, signature, contract} = params
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
            nonce,
            expiry,
            hash
        ],
        address: contract,
        abi: otcAbi
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


export const blockchainRow = (state, content, stepIcon, iconPadding, error, errorAction, colorOverride) => {
    return (
        <>
            <motion.div
                className={`flex flex-row  items-center text-[14px]  ${colorOverride ? colorOverride : getStatusColor(state)}`}
                layout
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={state}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={"flex flex-1 gap-3 items-center"}
                    >
                        <div className={`blob relative ${state === Transaction.Processing ? 'active' : ''}`}>
                            <DynamicIcon name={stepIcon} style={iconPadding}/>
                            {/*{ state == Transaction.Processing && <IconLoading className="animate-spin w-[30px] top-0 text-gold absolute"/>}*/}
                        </div>

                        <div className={"flex flex-1"}>{content}</div>

                        {state === Transaction.Executed && <div className={"rightIcon "}><DynamicIcon name={ICONS.CHECKMARK} style={"p-[2px]"}/></div>}
                        {state === Transaction.Failed && <div className={"rightIcon "} onClick={()=> {if(errorAction) errorAction()} }><Tooltiper wrapper={<DynamicIcon name={ICONS.ALERT} style={""}/>} text={`${error}`} type={TooltipType.Error}/></div>}
                        {/*{state == Transaction.Failed && <div className={"rightIcon error cursor-pointer"}><DynamicIcon name={ICONS.ALERT} style={""}/></div>}*/}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
            {stepIcon !== ICONS.ROCKET && <div className={"spacer"}></div> }
        </>
    );
};

