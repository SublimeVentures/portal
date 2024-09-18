import { PublicKey } from "@solana/web3.js";
import { isAddress } from "viem";
import { AirdropNetworkEnum } from "@/v2/lib/network";

export const isValidSolanaAddress = (address) => {
    try {
        let pubkey = new PublicKey(address);
        return PublicKey.isOnCurve(pubkey.toBuffer());
    } catch (error) {
        return false;
    }
};

export const isAddressValid = {
    [AirdropNetworkEnum.sol]: (address) => isValidSolanaAddress(address),
    [AirdropNetworkEnum.eth]: (address) => isAddress(address),
    [AirdropNetworkEnum.matic]: (address) => isAddress(address),
    [AirdropNetworkEnum.bsc]: (address) => isAddress(address),
    [AirdropNetworkEnum.avax]: (address) => isAddress(address),
    [AirdropNetworkEnum.sepolia]: (address) => isAddress(address),
};
