import OtcFacet from "@/components/App/Otc/OtcFacet.json";
import {ACLs}  from "@/lib/authHelpers";

export const getOtcTradeFunction = (isBuy, diamond, offerId, amount, price, currency, hash) => {
    return {
        method:'add',
        args: [
            offerId,
            amount * 10 ** 6,
            price * 10 ** 6,
            currency.address,
            isBuy,
            hash
        ],
        address: diamond,
        abi: OtcFacet
    }

}
export const getOtcCancelFunction = (source, offerId, dealId, ACL, address, nftId) => {
    switch (ACL) {
        case ACLs.Whale: {
                return {
                    method:'removeOffer',
                    args: [
                        dealId,
                        nftId,
                        offerId,
                    ],
                    address: source,
                    abi: OtcFacet
                }
        }
        default: {
            return {
                method:'removeOfferPartner',
                args: [
                    dealId,
                    offerId
                ],
                address: source,
                abi: OtcFacet
            }
        }
    }
}
export const getOtcBuyFunction = (source, offerId, dealId, ACL, nftId, currency) => {
    switch (ACL) {
        case ACLs.Whale: {
                return {
                    method:'settleOffer',
                    args: [
                        dealId,
                        nftId,
                        offerId,
                        currency
                    ],
                    address: source,
                    abi: OtcFacet
                }
        }
        default: {
            return {
                method:'settleOfferPartner',
                args: [
                    dealId,
                    offerId,
                    currency
                ],
                address: source,
                abi: OtcFacet
            }
        }
    }
}
