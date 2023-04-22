import axios from "axios";

export const fetchVault = async (acl, address) => {
    console.log("Fetching Offer List");
    try {
        let url = `/api/vault`
        if(acl !== undefined) {
            url+= `?acl=${acl}&address=${address}`
        }
        console.log("list url", url)
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        console.log("e: fetchOfferList",e)
    }
    return {}
}

