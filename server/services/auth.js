const {decode} = require("next-auth/jwt");
const cookie = require("cookie");

async function getAccessToken(req) {
    if(!req.headers.cookie) {
        return await checkSelfCall(req.headers)
    }
    const cookies = cookie.parse(req.headers.cookie)
    const sessionToken = cookies['next-auth.session-token']
    if (!process.env.NEXTAUTH_SECRET) throw new Error()
    return await decode({ token: sessionToken, secret: process.env.NEXTAUTH_SECRET })
}

async function checkSelfCall(headers) {
    return headers.host === process.env.URL

}

module.exports = { getAccessToken, checkSelfCall }
