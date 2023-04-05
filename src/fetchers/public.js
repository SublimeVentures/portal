import axios from "axios";

export const fetchPublicInvestments = async () => {
    console.log("Fetching public investments");
    const {data} = await axios.get("/api/public/investments")
    console.log("public investments", data)
    return data
}


export const fetchPartners = async () => {
    console.log("Fetching partners");
    const {data} = await axios.get("/api/public/partners")
    console.log("partners", data)
    return data
}

