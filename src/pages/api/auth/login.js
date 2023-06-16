import { recoverMessageAddress } from 'viem'
import Sentry from "@sentry/nextjs";
import { serialize } from "cookie";
// import {checkACL} from "@/controllers/login";
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const domain = new URL(process.env.DOMAIN)


const validateLogin = async (message, signature) => {
    try {
        const recoveredAddress = await recoverMessageAddress({
            message: message,
            signature: signature,
        })

        const validDomain = message.split('\n')[3].split('DOMAIN: ')[1] === domain.host
        if(!validDomain) return false;

        const userSession = {}
        // const userSession = await checkACL(recoveredAddress)
        console.log("userSession",{...{address: recoveredAddress}, ...userSession})
        return {...{address: recoveredAddress}, ...userSession}
    } catch (e) {
        console.log("validateLogin",e)
        return null
    }
}

const logIn = async (req, res) => {
    const userData = await validateLogin(req.body?.message, req.body?.signature)
    if(!userData)  return res.status(401).json({});

    const token = jwt.sign(userData, JWT_SECRET, {
        expiresIn: 3600,
    });

    const test = jwt.verify(token, JWT_SECRET);
    console.log("test",test)


    const serialised = serialize("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // todo: 30 days to long
        path: "/",
    });
    // Create your token using data, secret and time.
    res.setHeader("Set-Cookie", serialised);
    return res.status(200).json({access: token});
}

const logOut = async (req, res) => {
    const {cookies} = req;

    const jwt = cookies?.JWT
    if(jwt) {
        const serialised = serialize("jwt", null, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 5,
            path: "/",
        });
        // Create your token using data, secret and time.
        res.setHeader("Set-Cookie", serialised);
    }
    return res.status(200).json({});
}

const logFeed = async (req, res) => {

}

export default async function handler(req, res) {
    console.log("LOGIN HANDLER", req.body)
    switch(req.method) {
        case 'GET': {
            return logFeed(req, res);
        }
        case 'POST': {
            return logIn(req, res);
        }
        case 'DELETE': {
            return logOut(req,res)
        }
        default: {
            return res.status(500).json({});
        }
    }
}


