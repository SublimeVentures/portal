const {serialize} = require("cookie");
const {jwtVerify, SignJWT} = require("jose")

const ACLs = {
    Whale: 0,
    NeoTokyo: 1,
    Partner: 2,
    PartnerInjected: 3,
    Delegated: 4,
}

const domain = new URL(process.env.DOMAIN)
const userIdentification = 'address'
const JWT_REFRESH_SECRET_encode = new TextEncoder().encode(
    process.env.JWT_REFRESH_SECRET,
)
const JWT_ACCESS_SECRET_encode = new TextEncoder().encode(
    process.env.JWT_SECRET,
)
const alg = 'HS256'
const authTokenName = "x-auth-access"
const refreshTokenName = "x-refresh-access"


const retrieveToken = (name) => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(name)
    } else return null
}
const saveToken = (name, token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(name, token)
    } else return null
}
const clearToken = (name) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(name, null)
    } else return null
}

const generateToken = async (userData, length, encryption) => {
    return await new SignJWT({user: userData})
        .setProtectedHeader({alg})
        .setIssuedAt()
        .setExpirationTime(length)
        .sign(encryption)
}

const buildCookie = (name, content, maxAge) => {
    return serialize(name, content, {
        httpOnly: true,
        secure: process.env.ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
        path: '/',
    });
}

const verifyToken = async (token, secret) => {
    const {payload} = await jwtVerify(token, secret)
    if (!payload) throw new Error("Bad JWT")
    return payload
}

const verifyTokenAccess = async (req) =>{
    const token = req.cookies[authTokenName]
    if (token) {
        try {
            const session = await verifyToken(token, JWT_ACCESS_SECRET_encode)
            return {user:session?.user, auth: true}
        } catch (e) {
            if(e.code == "ERR_JWT_EXPIRED") return {auth: false, exists: !!token}
        }
    }
    return {auth: false}
}

const verifyTokenRefresh = async (req) =>{
    const token = req.headers[refreshTokenName]

    if (token) {
        try {
            const session = await verifyToken(token, JWT_REFRESH_SECRET_encode)
            return {user:session?.user, auth: true}
        } catch (e) {
            if(e.code === "ERR_JWT_EXPIRED ") return {auth: false, exists: !!token}
            console.log("AH :: verifyTokenRefresh - FAILED" )
        }
    }
    return {auth: false}
}

const verifyID = async (req, isRefresh) => {
    if (isRefresh) {
        return await verifyTokenRefresh(req)
    } else {
        return await verifyTokenAccess(req)
    }
}

module.exports = {
    ACLs,
    domain,
    userIdentification,
    JWT_REFRESH_SECRET_encode,
    JWT_ACCESS_SECRET_encode,
    authTokenName,
    refreshTokenName,
    retrieveToken,
    saveToken,
    clearToken,
    generateToken,
    buildCookie,
    verifyToken,
    verifyID,
}
