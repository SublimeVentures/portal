import {jwtVerify, SignJWT} from "jose";
import {serialize} from "cookie";
import {fetchWrapper} from "@/lib/fetchHandler";

export const ACLs = {
    Whale: 0,
    Partner: 1,
    PartnerInjected: 2,
    Delegated: 3,
}

export const domain = new URL(process.env.DOMAIN)

export const userIdentification = 'address'

export const JWT_REFRESH_SECRET_encode = new TextEncoder().encode(
    process.env.JWT_REFRESH_SECRET,
)
export const JWT_ACCESS_SECRET_encode = new TextEncoder().encode(
    process.env.JWT_SECRET,
)
export const alg = 'HS256'

export const retrieveToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.getItem("refresh")
    } else return null
}
export const saveToken = token => {
    if (typeof window !== 'undefined') {
        localStorage.setItem("refresh", token)
    } else return null
}
export const clearToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem("refresh", null)
    } else return null
}

export const generateToken = async (userData, length, encryption) => {
    return await new SignJWT({user: userData})
        .setProtectedHeader({alg})
        .setIssuedAt()
        .setExpirationTime(length)
        .sign(encryption)

}

export const buildCookie = (name, content, maxAge) => {
    return serialize(name, content, {
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
        path: '/',
    });
}

export const verifyToken = async (token, secret) => {
    const {payload} = await jwtVerify(token, secret)
    if (!payload) throw new Error("Bad JWT")
    return payload
}

export const verifyID = async (req, isMiddleware) => {
    let accessToken
    if (isMiddleware) {
        accessToken = req.cookies.get('x-auth-access')
        accessToken = accessToken?.value
    } else {
        accessToken = req.cookies['x-auth-access']
    }
    console.log("AH :: verifyID - accessToken", req.cookies, accessToken)
    if (accessToken) {
        try {
            const token = await verifyToken(accessToken, JWT_ACCESS_SECRET_encode)
            return {user:token?.user, auth: true}
        } catch (e) {
            console.log("AH :: verifyID - FAILED", ) //todo: uncomment
        }
    }
    return {auth: false}
}


export const signInQuery = async ( message, signature) =>{
    const request = await fetchWrapper.post(`/api/auth/login`, { message, signature })
    saveToken(request.refreshToken)
    return request.user
}

export const signOutQuery = async () =>{
    const request = await fetchWrapper.delete(`/api/auth/login`)
    console.log("reqest logout",request)
    if(request.logout) {
        clearToken(request.refreshToken)
        return true;
    }
    return false
}
