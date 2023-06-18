import Sentry from "@sentry/nextjs";
import {verifyID} from "@/lib/authHelpers";
import {connectDB, db, env} from "@/services/db";
import {getEnvironment} from "@/services/db/queries/environment.query";



export default async function handler(req, res) {
    const {auth, user} = await verifyID(req)
    if(!auth) return res.status(401).json({msg:'Token has expired'});


    console.log("all gucci", "user",user)
    const dane = await db(getEnvironment)
    console.log("dane", dane)

    return res.status(200).json({user});
}


