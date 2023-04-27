import OtcFacet from "@/components/App/Otc/OtcFacet.json";
import {ACL as ACLs}  from "@/lib/acl";

export const getOtcSellFunction = (source, offerId, amount, price, ACL, address, nftId) => {
    switch (ACL) {
        case ACLs.Whale: {
                return {
                    method:'addOffer',
                    args: [
                        amount * 10 ** 6,
                        price * 10 ** 6,
                        nftId,
                        offerId,
                        address
                    ],
                    address: source,
                    abi: OtcFacet
                }
        }
        default: {
            return {
                method:'addOfferPartner',
                args: [
                    amount * 10 ** 6,
                    price * 10 ** 6,
                    offerId
                ],
                address: source,
                abi: OtcFacet
            }
        }
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
