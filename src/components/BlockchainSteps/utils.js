import { isAddress } from "web3-validator";
import { BigNumber } from "bignumber.js";

import abi_claim from "../../../abi/ClaimFacet.json";
import abi_otc from "../../../abi/OtcFacet.abi.json";
import abi_invest from "../../../abi/InvestFacet.abi.json";

import abi_staking_neotokyo from "../../../abi/citcapStaking.abi.json";
import abi_staking_generic from "../../../abi/genericStaking.abi.json";

import abi_upgrade_generic from "../../../abi/genericUpgrade.abi.json";
import abi_upgrade_neotokyo from "../../../abi/neoTokyoUpgrade.abi.json";
import abi_upgrade_based from "../../../abi/UpgradeFacet.json";

import abi_mb_generic from "../../../abi/genericMysteryBox.abi.json";
import abi_mb_based from "../../../abi/basedMysteryBox.abi.json";
import abi_mb_neotokyo from "../../../abi/neotokyoMysteryBox.abi.json";
import { blockchainPrerequisite as prerequisite_claimPayout } from "@/components/App/Vault/ClaimPayoutModal";
import { blockchainPrerequisite as prerequisite_otcTakeOffer } from "@/components/App/Otc/TakeOfferModal";
import { blockchainPrerequisite as prerequisite_otcMakeOffer } from "@/components/App/Otc/MakeOfferModal";
import { blockchainPrerequisite as prerequisite_mysteryBoxBuy } from "@/components/App/MysteryBox/BuyMysteryBoxModal";
import { blockchainPrerequisite as prerequisite_upgradeBuy } from "@/components/App/Store/BuyStoreItemModal";

import { TENANT } from "@/lib/tenantHelper";
export const ETH_USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

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
    ALLOWANCE: 9,
    CLAIM: 10,
};

const TENANT_STAKE = (params) => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.NeoTokyo: {
            return {
                name: "stake",
                inputs: [],
                abi: abi_staking_neotokyo,
                confirmations: 2,
                contract: params.contract,
            };
        }
        case TENANT.CyberKongz: {
            return {
                name: "stakeNoGuards",
                inputs: [process.env.NEXT_PUBLIC_TENANT, params.allowance],
                abi: abi_staking_generic,
                confirmations: 2,
                contract: params.contract,
            };
        }
        case TENANT.BAYC: {
            return {
                name: "stakeV2",
                inputs: [process.env.NEXT_PUBLIC_TENANT, params.delegated],
                abi: abi_staking_generic,
                confirmations: 2,
                contract: params.contract,
            };
        }
    }
};

const TENANT_UNSTAKE = (params) => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.NeoTokyo: {
            return {
                name: "unstake",
                inputs: [],
                abi: abi_staking_neotokyo,
                confirmations: 2,
                contract: params.contract,
            };
        }
        default: {
            return {
                name: "unstake",
                inputs: [process.env.NEXT_PUBLIC_TENANT],
                abi: abi_staking_generic,
                confirmations: 2,
                contract: params.contract,
            };
        }
    }
};

const TENANT_UPGRADE = (params, token) => {
    console.log("dupeks ", Number(process.env.NEXT_PUBLIC_TENANT), TENANT.BAYC);
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.NeoTokyo: {
            return {
                name: "buyUpgrade",
                inputs: [params.amount, params.upgradeId],
                abi: abi_upgrade_neotokyo,
                confirmations: 2,
                contract: params.contract,
            };
        }
        case TENANT.CyberKongz:
        case TENANT.BAYC: {
            return {
                name: "buyUpgrade",
                inputs: [process.env.NEXT_PUBLIC_TENANT, params.amount, params.upgradeId, token.contract],
                abi: abi_upgrade_generic,
                confirmations: 2,
                contract: params.contract,
            };
        }
        default: {
            return {
                name: "buyUpgrade",
                inputs: [
                    params.amount, 
                    params.upgradeId, 
                    token.contract,
                    params.hash, params.signature, params.expires
                ],
                abi: abi_upgrade_based,
                confirmations: 2,
                contract: params.contract,
            };
        }
    }
};

// @TODO
const TENANT_MYSTERYBOX = (params, token) => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.NeoTokyo: {
            return {
                name: "buyMysteryBox",
                inputs: [params.amount],
                abi: abi_mb_neotokyo,
                confirmations: 2,
                contract: params.contract,
            };
        }
        case TENANT.CyberKongz: {
            return {
                name: "buyMysteryBox",
                inputs: [process.env.NEXT_PUBLIC_TENANT, params.amount, token.contract],
                abi: abi_mb_generic,
                confirmations: 2,
                contract: params.contract,
            };
        }
        default: {
            return {
                name: "buyMysteryBox",
                inputs: [
                    params.amount,
                    token.contract,
                    params.hash, params.signature, params.expires
                ],
                abi: abi_mb_based,
                confirmations: 2,
                contract: params.contract,
            };
        }
    }
};

const validAddress = (address) => {
    return typeof address === "string" && isAddress(address);
};
const validHash = (hash) => {
    return typeof hash === "string" && hash !== "" && hash.length > 0;
};
const validToken = (token) => {
    return typeof token === "string" && isAddress(token.address);
};
const validNumber = (amount) => {
    return typeof amount === "number" && amount > 0;
};
const validAllowance = (amount) => {
    return typeof amount === "number" && amount >= 0;
};
const validBoolean = (state) => {
    return typeof state === "boolean";
};
const getTokenInWei = (amount, token) => {
    const power = BigNumber(10).pow(token.precision);
    const result = BigNumber(amount).multipliedBy(power);
    return result.toFixed();
};

export const getMethod = (type, token, params) => {
    switch (type) {
        case METHOD.INVEST: {
            const isValid =
                validAddress(token?.contract) &&
                validNumber(params?.offerId) &&
                validNumber(params?.partnerId) &&
                validAddress(params?.spender) &&
                validHash(params?.booking?.code) &&
                validHash(params?.booking?.signature) &&
                validNumber(params?.booking.expires) &&
                validNumber(params?.booking.amount);
            return isValid
                ? {
                      ok: true,
                      method: {
                          name: "invest",
                          inputs: [
                              params.booking.code,
                              params.partnerId,
                              params.offerId,
                              params.amount,
                              params.booking.expires,
                              token.contract,
                              params.booking.signature,
                          ],
                          abi: abi_invest,
                          confirmations: 2,
                          contract: params.spender,
                      },
                  }
                : {
                      ok: false,
                      error: "Validation failed",
                  };
        }
        case METHOD.ALLOWANCE: {
            const isValid =
                validAddress(token?.contract) && validAddress(params?.spender) && validAllowance(params?.allowance);
            const amount = getTokenInWei(params.allowance, token);
            const confirmations = params.chainId === 1 ? 2 : 5;
            console.log("METHOD.ALLOWANCE", type, token, params, isValid);

            return isValid
                ? {
                      ok: true,
                      method: {
                          name: "approve",
                          inputs: [params.spender, amount],
                          abi: token.abi,
                          confirmations: confirmations,
                          contract: token.contract,
                      },
                  }
                : {
                      ok: false,
                      error: "Validation failed",
                  };
        }
        case METHOD.OTC_MAKE: {
            console.log("params.price", params.price.toString());
            const isValid =
                validHash(params.prerequisite?.hash) &&
                validAllowance(params.market.otc) &&
                validNumber(params.price) &&
                validNumber(params.market.otc) &&
                validBoolean(params.isSeller) &&
                validAddress(token?.contract) &&
                validAddress(params?.contract);
            const amount = getTokenInWei(params.price, token);
            console.log("amount", amount);
            return isValid
                ? {
                      ok: true,
                      method: {
                          name: "offerMake",
                          inputs: [
                              params.prerequisite.hash,
                              params.market.otc,
                              amount,
                              token.contract,
                              params.isSeller,
                          ],
                          abi: abi_otc,
                          confirmations: 2,
                          contract: params.contract,
                      },
                  }
                : {
                      ok: false,
                      error: "Validation failed",
                  };
        }
        case METHOD.OTC_CANCEL: {
            const isValid = validNumber(params?.otcId) && validNumber(params?.dealId) && validAddress(params?.contract);
            console.log("CHECK PARAMS", params, isValid);
            return isValid
                ? {
                      ok: true,
                      method: {
                          name: "offerCancel",
                          inputs: [params?.otcId, params.dealId],
                          abi: abi_otc,
                          confirmations: 2,
                          contract: params.contract,
                      },
                  }
                : {
                      ok: false,
                      error: "Validation failed",
                  };
        }
        case METHOD.OTC_TAKE: {
            console.log("offerTakeParams", params);

            const isValid =
                validNumber(params?.offerDetails?.otcId) &&
                validNumber(params?.offerDetails?.dealId) &&
                validAddress(params?.contract) &&
                !params?.offerDetails?.isSell
                    ? validNumber(params?.prerequisite?.signature?.nonce) &&
                      validNumber(params?.prerequisite?.signature?.expiry) &&
                      validHash(params?.prerequisite?.signature?.hash)
                    : true;
            console.log("offerTakeParams isValid", isValid);

            const nonce = params?.prerequisite?.signature?.nonce || 0;
            const expiry = params?.prerequisite?.signature?.expiry || 0;
            const hash = params?.prerequisite?.signature?.hash || "";
            return isValid
                ? {
                      ok: true,
                      method: {
                          name: "offerTake",
                          inputs: [params.offerDetails.otcId, params.offerDetails.dealId, nonce, expiry, hash],
                          abi: abi_otc,
                          confirmations: 2,
                          contract: params.contract,
                      },
                  }
                : {
                      ok: false,
                      error: "Validation failed",
                  };
        }
        case METHOD.MYSTERYBOX: {
            const isValid = validNumber(params?.amount) && validAddress(params?.contract);
            const method = TENANT_MYSTERYBOX(params, token);
            return isValid
                ? {
                      ok: true,
                      method,
                  }
                : {
                      ok: false,
                      error: "Validation failed",
                  };
        }
        case METHOD.UPGRADE: {
            const isValid =
                validNumber(params?.amount) && validNumber(params?.upgradeId) && validAddress(params?.contract);
            const method = TENANT_UPGRADE(params, token);
            console.log("UPGRADEE", process.env.NEXT_PUBLIC_TENANT, method);
            return isValid
                ? {
                      ok: true,
                      method,
                  }
                : {
                      ok: false,
                      error: "Validation failed",
                  };
        }
        case METHOD.STAKE: {
            console.log("params - METHOD.STAKE", params);
            const isValid =
                validNumber(params?.allowance) &&
                validNumber(params?.liquidity) &&
                validAddress(params?.contract) &&
                validAddress(token?.contract);
            const method = TENANT_STAKE(params);
            return isValid
                ? {
                      ok: true,
                      method,
                  }
                : {
                      ok: false,
                      error: "Validation failed",
                  };
        }
        case METHOD.UNSTAKE: {
            const isValid = validAddress(params?.contract);
            const method = TENANT_UNSTAKE(params);
            return isValid
                ? {
                      ok: true,
                      method,
                  }
                : {
                      ok: false,
                      error: "Validation failed",
                  };
        }
        case METHOD.CLAIM: {
            const isValid =
                validAddress(params?.contract) &&
                validHash(params?.prerequisite?.signature) &&
                validNumber(params?.amount) &&
                validNumber(params?.offerId) &&
                validNumber(params?.payoutId) &&
                validNumber(params?.claimId);
            console.log("validation CLAIMER", params, isValid, validHash(params?.prerequisite?.signature));

            return isValid
                ? {
                      ok: true,
                      method: {
                          name: "claimPayout",
                          inputs: [
                              params.offerId,
                              params.payoutId,
                              params.claimId,
                              params.amount,
                              params.prerequisite.signature,
                          ],
                          abi: abi_claim,
                          confirmations: 2,
                          contract: params.contract,
                      },
                  }
                : {
                      ok: false,
                      error: "Validation failed",
                  };
        }
    }
};

export const getPrerequisite = async (type, params) => {
    switch (type) {
        case METHOD.NONE: {
            return { ok: false, method: {} };
        }
        case METHOD.OTC_MAKE: {
            return await prerequisite_otcMakeOffer(params);
        }
        case METHOD.OTC_TAKE: {
            return await prerequisite_otcTakeOffer(params);
        }
        case METHOD.CLAIM: {
            return await prerequisite_claimPayout(params);
        }
        case METHOD.MYSTERYBOX: {
            return await prerequisite_mysteryBoxBuy(params);
        }
        case METHOD.UPGRADE: {
            return await prerequisite_upgradeBuy(params);
        }
        default: {
            return { ok: true, data: {} };
        }
    }
};
