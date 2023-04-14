import axios from "axios";

export const fetchOfferList = async () => {
    console.log("Fetching Offer List");
    try {
        const {data} = await axios.get(`/api/offer`)
        console.log("offer list", data)
        return data
    } catch(e) {
        console.log("e: fetchOfferList",e)
    }
    return {}
}

export const fetchOfferDetails = async (slug) => {
    if(!slug) return {}

    console.log("Fetching Offer Details", slug);
    try {
        const {data} = await axios.get(`/api/offer/${slug}`)
        console.log("offer details", data)
        return data
    } catch(e) {
        console.log("e: fetchOfferDetails",e)
    }
    return {}
}


