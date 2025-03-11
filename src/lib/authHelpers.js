const { serialize } = require("cookie");
const { jwtVerify } = require("jose");
const axios = require("axios");

const domain = new URL(process.env.DOMAIN);

const JWT_REFRESH_SECRET_encode = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);
const JWT_ACCESS_SECRET_encode = new TextEncoder().encode(process.env.JWT_SECRET);

const authTokenName = "x-auth-access";
const refreshTokenName = "x-refresh-access";

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

const verifyID = async (req, isRefresh) => {
    let token;
    try {
        token = req.cookies[isRefresh ? refreshTokenName : authTokenName];
        if (token) {
            const session = await verifyToken(token, isRefresh ? JWT_REFRESH_SECRET_encode : JWT_ACCESS_SECRET_encode);
            if (session.user) {
                return { user: session?.user, auth: true };
            }
        }
    } catch (error) {
        if (error.code === "ERR_JWT_EXPIRED") return { auth: false, exists: !!token };
        console.error("Error verifying Id", error);
    }

    return { auth: false };
};

const refreshData = async (refreshToken) => {
    try {
        const response = await axios.put(
            `${process.env.AUTHER}/auth/login`,
            { token: refreshToken },
            {
                headers: { "content-type": "application/json" },
            },
        );

        const result = response.data;
        if (!result?.ok) throw Error(`AUTH err: ${result.error}`);

        return result;
    } catch (error) {
        console.error("Error refreshing data:", error);
        return { ok: false }; // Or handle the error as appropriate
    }
};

module.exports = {
    domain,
    JWT_REFRESH_SECRET_encode,
    JWT_ACCESS_SECRET_encode,
    authTokenName,
    refreshTokenName,
    buildCookie,
    verifyToken,
    verifyID,
    refreshData,
};
