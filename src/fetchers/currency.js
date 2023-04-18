import axios from "axios";

export const fetchPayableCurrency = async () => {
    console.log("Fetching Payable Currency List");
    try {
        let url = `/api/payable`
        const {data} = await axios.get(url)
        console.log("FETCH :: Currency list", data)
        return data
    } catch(e) {
        console.log("e: fetchPayableCurrency",e)
    }
    return {}
}


