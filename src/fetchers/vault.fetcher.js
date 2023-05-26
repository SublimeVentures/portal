import axios from "axios";

export const fetchUserInvestment = async (offerId) => {
    console.log("Fetching Vault List");
    try {
        let url = `/api/vault?offer=${offerId}`
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        console.log("e: fetchInvestment",e)
    }
    return {}
}

export const fetchVault = async (acl, address) => {
    console.log("fetchInvestments",acl, address)
    try {
        let url = `/api/vault/all`
        if(acl !== undefined) {
            url+= `?acl=${acl}&address=${address}`
        }
        console.log("url",url)
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        console.log("e: fetchOfferDetails",e)
    }
    return []
}

