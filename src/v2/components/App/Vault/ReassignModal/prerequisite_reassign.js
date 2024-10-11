import { reassignOfferAllocation } from "@/v2/fetchers/reassign.fetcher";
export const blockchainPrerequisite = async (params) => {
    try {
        const { offer, currency, to, chain } = params;
        console.log("REASSIGN_SIGNATURE_VALID", params);

        const transaction = await reassignOfferAllocation(offer, currency, to, chain);

        console.log("REASSIGN_SIGNATURE", transaction);

        if (transaction.ok && transaction.signature) {
            return {
                ok: true,
                data: { signature: transaction.signature, expire: transaction.expire },
            };
        } else {
            //todo: error handling
            return {
                ok: false,
            };
        }
    } catch (error) {
        return {
            ok: false,
        };
    }
};
