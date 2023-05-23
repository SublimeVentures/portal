import axios from "axios";

export const fetchPayableCurrency = async () => {
    console.log("Fetching Payable Currency List");
    try {
        let url = `/api/chain/currencies`
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        console.log("e: fetchPayableCurrency",e)
    }
    return {}
}


