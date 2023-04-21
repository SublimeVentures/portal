import axios from "axios";

export const fetchHash = async (id, amount, currency) => {
    console.log("Fetching Investment Hash");
    try {
        let url = `/api/invest?id=${id}&amount=${amount}&currency=${currency}`
        console.log("list url", url)
        const {data} = await axios.get(url)
        console.log("investment hash", data)
        return data
    } catch(e) {
        console.log("e: fetchHash",e)
    }
    return {}
}

export const expireHash = async (id, hash) => {
    try {
        let url = `/api/invest/hash?id=${id}&hash=${hash}`
        const {data} = await axios.get(url)
        console.log("obsolete hash", data, url)
        return data
    } catch(e) {
        console.log("e: expireHash",e)
    }
    return {}
}

export const updateCurrency = async (id, hash, currency) => {
    try {
        let url = `/api/invest/update`
        const {data} = await axios.post(url, JSON.stringify({id, hash, currency}), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        console.log("obsolete hash", data, url)
        return data
    } catch(e) {
        console.log("e: expireHash",e)
    }
    return {}
}

