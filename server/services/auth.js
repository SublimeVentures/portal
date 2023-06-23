// // const {decode} = require("next-auth/jwt");
// const cookie = require("cookie");
// const meta = process.env.FORCE_DEV === "true" ? "next-auth.session-token" : (process.env.ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token")
//
// async function getAccessToken(req) {
//     if(!req.headers.cookie) {
//         return await checkSelfCall(req.headers)
//     }
//     const cookies = cookie.parse(req.headers.cookie)
//     const sessionToken = cookies[meta]
//     if (!process.env.NEXTAUTH_SECRET) throw new Error()
//     return await decode({ token: sessionToken, secret: process.env.NEXTAUTH_SECRET })
// }
//
// async function checkSelfCall(headers) {
//     return headers.host === process.env.LOCAL_HOSTNAME || headers.host === process.env.URL
// }
//
// module.exports = { getAccessToken, checkSelfCall }
