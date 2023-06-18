import Sentry from "@sentry/nextjs";
import {verifyID} from "@/lib/authHelpers";



export default async function handler(req, res) {
    const {auth, user} = await verifyID(req)
    if(!auth) return res.status(401).json({msg:'Token has expired'});

    console.log("all gucci", "user",user)
    return res.status(200).json({user});
}


