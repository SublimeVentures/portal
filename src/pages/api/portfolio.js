import {db} from "@/services/db";
import {getPortfolio} from "@/services/db/queries/offers.query";

export default async function handler(req, res) {
    return res.status(200).json(await db(getPortfolio));
}


