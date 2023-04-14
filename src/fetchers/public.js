import axios from "axios";

export const fetchPublicInvestments = async () => {
    const {data} = await axios.get("/api/public/investments")
    return data
}

export const fetchPartners = async () => {
    const {data} = await axios.get("/api/public/partners")
    return data
}

