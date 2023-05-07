const {decode} = require("next-auth/jwt");
const cookie = require("cookie");
// const meta = process.env.ENV === "production" ? "__Host-next-auth.csrf-token" : "next-auth.csrf-token"
async function getAccessToken(req) {
    if(!req.headers.cookie) {
        return await checkSelfCall(req.headers)
    }
    const cookies = cookie.parse(req.headers.cookie)
    console.log("cookie", cookies, process.env.NEXTAUTH_SECRET)
    const sessionToken = cookies["next-auth.csrf-token"].split("|")[0]
    console.log("decode", { token: sessionToken, secret: process.env.NEXTAUTH_SECRET })

    if (!process.env.NEXTAUTH_SECRET) throw new Error()
    return await decode({ token: sessionToken, secret: process.env.NEXTAUTH_SECRET })
}

async function checkSelfCall(headers) {
    return headers.host === process.env.URL

}

module.exports = { getAccessToken, checkSelfCall }
