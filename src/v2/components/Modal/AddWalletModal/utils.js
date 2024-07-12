import { PublicKey } from "@solana/web3.js";

export const isValidSolanaAddress = (address) => {
    try {
        let pubkey = new PublicKey(address);
        return PublicKey.isOnCurve(pubkey.toBuffer());
    } catch (error) {
        return false;
    };
};

export const isAddressValid = {
    solana: (address) => isValidSolanaAddress(address),
};
