import axios from "axios";

export const fetchOfferList = async (acl, address) => {
    try {
        let url = `/api/offer`
        if(acl !== undefined) {
            url+= `?acl=${acl}&address=${address}`
        }
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        console.log("e: fetchOfferList",e)
    }
    return {}
}

export const fetchOfferDetails = async (slug, acl, address) => {
    if(!slug) return {}
    // console.log("Fetching Offer Details", slug, acl);
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


export const fetchOfferAllocation = async (id) => {
    if(!id) return {}
    try {
        let url = `/api/offer/${id}/allocation`
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        console.log("e: fetchOfferAllocation",e)
    }
    return {}
}


