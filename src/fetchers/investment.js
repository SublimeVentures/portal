import axios from "axios";

export const fetchInvestment = async (offerId) => {
    console.log("Fetching Offer List");
    try {
        let url = `/api/vault?offer=${offerId}`
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        console.log("e: fetchInvestment",e)
    }
    return {}
}

export const fetchInvestments = async (slug, acl, address) => {
    if(!slug) return {}

    console.log("Fetching Offer Details", slug, acl);
    try {
        let url = `/api/offer/${slug}`
        if(acl !== undefined) {
            url+= `?acl=${acl}&address=${address}`
        }
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        console.log("e: fetchOfferDetails",e)
    }
    return {}
}

