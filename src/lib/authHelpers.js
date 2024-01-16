const {serialize} = require("cookie");
const {jwtVerify} = require("jose")
const axios = require('axios');

const domain = new URL(process.env.DOMAIN)

const JWT_REFRESH_SECRET_encode = new TextEncoder().encode(
    process.env.JWT_REFRESH_SECRET,
)
const JWT_ACCESS_SECRET_encode = new TextEncoder().encode(
    process.env.JWT_SECRET,
)

const authTokenName = "x-auth-access"
const refreshTokenName = "x-refresh-access"

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

const verifyID = async (req, isRefresh) => {
    const token = req.cookies[isRefresh ? refreshTokenName : authTokenName]
    if (token) {
        try {
            const session = await verifyToken(token, isRefresh? JWT_REFRESH_SECRET_encode : JWT_ACCESS_SECRET_encode)
            return {user:session?.user, auth: true}
        } catch (e) {
            if(e.code == "ERR_JWT_EXPIRED") return {auth: false, exists: !!token}
        }
    }
    return {auth: false}
}

const refreshTokens = async (refreshToken) => {
        try {
            const response = await axios.put(`${process.env.AUTHER}/auth/login`, { token: refreshToken }, {
                headers: { 'content-type': 'application/json' }
            });

            const result = response.data;
            if (!result?.ok) throw new Error("Bad AUTHER response");

            return result
        } catch (error) {
            console.error('Error refreshing token:', error);
            return {ok:false}; // Or handle the error as appropriate
        }
}

const ACLs = {}

module.exports = {
    ACLs,
    domain,
    JWT_REFRESH_SECRET_encode,
    JWT_ACCESS_SECRET_encode,
    authTokenName,
    refreshTokenName,
    buildCookie,
    verifyToken,
    verifyID,
    refreshTokens,
}
