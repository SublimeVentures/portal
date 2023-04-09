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
