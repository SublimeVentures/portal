import axios from "axios";

export const fetchPublicInvestments = async (address) => {
    console.log("Fetching user type", address);
    try {
        const {data} = await axios.get(`/api/validate/l0gin/${address}`)
        console.log("public investments", data)

    } catch(e) {
        console.log("e",e)
    }
    return {}
}
