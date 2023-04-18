import axios from "axios";

export const fetchOfferList = async (acl, address) => {
    console.log("Fetching Offer List");
    try {
        let url = `/api/offer`
        if(acl !== undefined) {
            url+= `?acl=${acl}&address=${address}`
        }
        console.log("list url", url)
        const {data} = await axios.get(url)
        console.log("offer list", data)
        return data
    } catch(e) {
        console.log("e: fetchOfferList",e)
    }
    return {}
}

export const fetchOfferDetails = async (slug, acl, address) => {
    if(!slug) return {}

    console.log("Fetching Offer Details", slug, acl);
    try {
        let url = `/api/offer/${slug}`
        if(acl !== undefined) {
            url+= `?acl=${acl}&address=${address}`
        }
        console.log("details url", url)
        const {data} = await axios.get(url)
        console.log("offer details from server", data)
        return data
    } catch(e) {
        console.log("e: fetchOfferDetails",e)
    }
    return {}
}


export const fetchOfferAllocation = async (id) => {
    if(!id) return {}

    console.log("Fetching Offer Allocation", id,);
    try {
        let url = `/api/offer/${id}/allocation`
        console.log("allocation url", url)
        const {data} = await axios.get(url)
        console.log("offer allocation from server", data)
        return data
    } catch(e) {
        console.log("e: fetchOfferAllocation",e)
    }
    return {}
}


