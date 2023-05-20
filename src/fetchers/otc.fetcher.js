import axios from "axios";

export const fetchMarkets = async () => {
    console.log("Fetching Market List");
    try {
        let url = `/api/otc/markets`
        const {data} = await axios.get(url)
        console.log("fetchMarkets",data)
        return data
    } catch(e) {
        console.log("e: fetchMarkets",e)
    }
    return {}
}


export const fetchOffers = async (offerId) => {
    console.log("Fetching Market Offer");
    try {
        let url = `/api/otc/offers/${offerId}`
        console.log("url", url)
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        console.log("e: fetchOffers",e)
    }
    return {}
}

export const fetchHistory = async (offerId) => {
    console.log("Fetching Market Filled");
    try {
        let url = `/api/otc/history/${offerId}`
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        console.log("e: fetchFilled",e)
    }
    return {}
}

export const saveTransaction = async (offerId, networkChainId, isBuyer, amount, price) => {
    console.log("Fetching Save Transaction");
    try {
        const {data} = await axios.post(`/api/otc/${offerId}/create`, {
            isBuyer,
            amount,
            price,
            networkChainId
        })
        return data
    } catch(e) {
        console.log("e: fetchFilled",e)
    }
    return {}
}

export const removeTransaction = async (offerId, hash) => {
    console.log("Fetching Remove Transaction");
    try {
        const {data} = await axios.post(`/api/otc/${offerId}/remove`, {
            hash
        })
        return data
    } catch(e) {
        console.log("e: removeTransaction",e)
    }
    return {}
}

