import axios from "axios";

export const fetchSessionData = async (address) => {
    console.log("Fetching user type", address);
    try {
        const {data} = await axios.get(`/api/validate/l0gin/${address}`)
        return data
    } catch(e) {
        console.log("e: fetchSessionData",e)
    }
    return {}
}

export const fetchEnabledPartners = async () => {
    const {data} = await axios.get("/api/validate/partners")
    return data
}


export const saveDelegation = async (address, vault, partner, tokenId) => {
    const {data} = await axios.post("/api/validate/delegate", {address, vault, partner, tokenId}, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    return data
}

