import moment from "moment";

import { getSignature } from "@/fetchers/otc.fetcher";

export const blockchainPrerequisite = async (params) => {
    const { globalState, requiredNetwork, account, offerDetails } = params;
    console.log("TAK_OFFER_VALID", params);
    
    const { extra: signature } = globalState.prerequisite;
    console.log(
        "TAK_OFFER_VALID2",
        signature,
        signature?.expiry && signature.expiry > moment.utc().unix() && !offerDetails.isSell,
        offerDetails.isSell,
    );

    if (signature?.expiry && signature.expiry > moment.utc().unix() && !offerDetails.isSell) {
        return {
            ok: true,
            data: { signature },
        };
    } else if (offerDetails.isSell) {
        return {
            ok: true,
            data: { valid: true },
        };
    } else {
        const transaction = await getSignature(
            offerDetails.offerId,
            requiredNetwork,
            offerDetails.otcId,
            offerDetails.dealId,
            account,
        );
        console.log("TAK_OFFER_VALID3", transaction);
        if (transaction.ok) {
            return {
                ok: true,
                data: { signature: transaction.data },
            };
        } else {
            
            //todo: error handling
            return {
                ok: false,
            };
        };
    };
};
