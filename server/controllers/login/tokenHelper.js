const { serialize } = require("cookie");
const { jwtVerify, SignJWT } = require("jose");

const authTokenValidityLength = 15; //min
const refreshTokenValidityLength = 12; //hours

const userIdentification = "userId";
const JWT_REFRESH_SECRET_encode = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);
const JWT_ACCESS_SECRET_encode = new TextEncoder().encode(process.env.JWT_SECRET);

const alg = "HS256";
const authTokenName = "x-auth-access";
const refreshTokenName = "x-refresh-access";

const generateToken = async (userData, length, encryption) => {
    return await new SignJWT({ user: userData })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(length)
        .sign(encryption);
};

const buildCookie = (name, content, maxAge) => {
    return serialize(name, content, {
        httpOnly: true,
        secure: process.env.ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
        path: "/",
    });
};

const verifyToken = async (token, secret) => {
    const { payload } = await jwtVerify(token, secret);
    if (!payload) throw new Error("Bad JWT");
    return payload;
};

const refreshCookies = async (token) => {
    try {
        const refreshAuthData = await refreshAuth(token);
        if (refreshAuthData) {
            return {
                ...refreshAuthData,
                ok: true,
            };
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
    }
    return { ok: false };
};

const refreshAuth = async ({ accessToken, refreshToken }) => {
    const accessCookie = buildCookie(authTokenName, accessToken, authTokenValidityLength * 60 * 1000);
    const refreshCookie = buildCookie(refreshTokenName, refreshToken, refreshTokenValidityLength * 60 * 60 * 1000);

    return {
        cookie: {
            refreshCookie,
            accessCookie,
        },
        token: {
            accessToken,
            refreshToken,
        },
    };
};

module.exports = {
    userIdentification,
    JWT_REFRESH_SECRET_encode,
    JWT_ACCESS_SECRET_encode,
    authTokenName,
    refreshTokenName,
    generateToken,
    buildCookie,
    verifyToken,
    refreshCookies,
    refreshAuth,
};
