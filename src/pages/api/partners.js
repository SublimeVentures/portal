import {db} from "@/services/db";
import {getPublicPartners} from "@/services/db/queries/partners.query";

export default async function handler(req, res) {
    return res.status(200).json(await db(getPublicPartners));
}


