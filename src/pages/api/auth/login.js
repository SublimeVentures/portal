import {recoverMessageAddress} from 'viem'
import Sentry from "@sentry/nextjs";

import {
    buildCookie,
    generateToken,
    JWT_ACCESS_SECRET_encode,
    JWT_REFRESH_SECRET_encode,
    userIdentification, verifyID, verifyToken
} from "@/lib/authHelpers";

let REFRESH_TOKENS = {}
let id = 0

const validateLogin = async (message, signature) => {
    try {
        const recoveredAddress = await recoverMessageAddress({
            message: message,
            signature: signature,
        })

        const validDomain = message.split('\n')[3].split('DOMAIN: ')[1] === domain.host
        if (!validDomain) return false;

        const userSession = {}
        // const userSession = await checkACL(recoveredAddress)
        console.log("userSession", {...{address: recoveredAddress}, ...userSession})
        return {...{address: recoveredAddress}, ...userSession}
    } catch (e) {
        console.log("validateLogin", e)
        return null
    }
}


const refreshAuth = async (userData, res) => {
    const accessToken = await generateToken(userData, '10s', JWT_ACCESS_SECRET_encode)
    // const accessToken = await generateToken(userData, '15m', JWT_ACCESS_SECRET_encode)
    const refreshToken = await generateToken(userData, '12h', JWT_REFRESH_SECRET_encode)
    const accessCookie = buildCookie('x-auth-access', accessToken, 60 * 60 * 5,)

    console.log("LOGIN FLOW ::  PREP SET CREDENTIALS - add refresh",userData[userIdentification], {
        refreshToken,
        userData,
    })

    REFRESH_TOKENS[userData[userIdentification]] = {
        refreshToken,
        userData,
    }
    console.log("LOGIN FLOW ::  UPDATED CREDENTIALS",REFRESH_TOKENS[userData[userIdentification]], Object.keys(REFRESH_TOKENS).length )

    res.setHeader("Set-Cookie", accessCookie);
    return res.status(200).json({user: userData, refreshToken});
}

const logIn = async (req, res) => {
    console.log("LOGIN FLOW ::  LOGIN")
    //todo: uncomment
    // const userData = await validateLogin(req.body?.message, req.body?.signature)
    // if(!userData)  return res.status(401).json({error:"No authorized NFT found"});

    const userData = {
        address: "random_address" + id++,
        nftId: id
    }

    return await refreshAuth(userData, res)
}


const refreshToken = async (req, res) => {
    console.log("LOGIN FLOW ::  REFRESH", REFRESH_TOKENS, Object.keys(REFRESH_TOKENS).length )

    if (!req.headers['x-refresh']) return res.status(401).json({});
    const refreshToken = req.headers['x-refresh']
    try {
        const token = await verifyToken(refreshToken, JWT_REFRESH_SECRET_encode)
        const session = REFRESH_TOKENS[token.user[userIdentification]]
        console.log("LOGIN FLOW ::  REFRESH - token decrypt",token, token.user[userIdentification])
        console.log("LOGIN FLOW ::  REFRESH - ", session)

        // delete REFRESH_TOKENS[token.user[userIdentification]];
        if (token.user[userIdentification] !== session.userData[userIdentification]) {
            throw new Error("data not match")
        }

        return await refreshAuth(session.userData, res)
    } catch (e) {
        console.log("LOGIN FLOW ::  REFRESH - FAILED", e)
        return res.status(403).json({});
    }

}

const logFeed = async (req, res) => {
    try {
            const {auth, user} = await verifyID(req, false);
            if(!auth) throw new Error("Not authorized")
            return res.status(200).json({...user});
    } catch (e) {
    }
    return res.status(401).json({});
}

const logOut = async (req, res) => {
    try {
        const {auth, user} = await verifyID(req)
        if(!auth) throw new Error("Not authorized")
        delete REFRESH_TOKENS[user[userIdentification]];
        const cookie = buildCookie('x-auth-access', null, -1)
        res.setHeader("Set-Cookie", cookie);
        return res.status(200).json({logout: true});
    } catch (e) {
    }
    return res.status(401).json({});
}


export default async function handler(req, res) {
    console.log("LOGIN FLOW :: current refresh token table",REFRESH_TOKENS)
    switch (req.method) {
        case 'GET': {
            return await logFeed(req, res);
        }
        case 'POST': {
            return await logIn(req, res);
        }
        case 'DELETE': {
            return await logOut(req, res)
        }
        case 'PUT': {
            return await refreshToken(req, res)
        }
        default: {
            return res.status(500).json({});
        }
    }
}


