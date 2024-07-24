import { PublicKey } from "@solana/web3.js";

import { AirdropNetworkEnum } from "@/v2/lib/network";

export const isValidSolanaAddress = (address) => {
    try {
        let pubkey = new PublicKey(address);
        return PublicKey.isOnCurve(pubkey.toBuffer());
    } catch (error) {
        return false;
    };
};

export const isAddressValid = {
    [AirdropNetworkEnum.sol]: (address) => isValidSolanaAddress(address),
};
