import Sentry from "@sentry/nextjs";
import {signInQuery} from "@/lib/authHelpers";

export const singIn = async (message, signature) => {
    try {
        const request = await signInQuery(message, signature)
        console.log("request result - singIn", request)
        return true //todo: redirect
    } catch (e) {
        console.log("singIn", e)
        Sentry.captureException({location: "singIn", e});
    }
    return {}
}

//
// const login = (email, password) => {
//     return fetchJSON('/api/auth/login', {
//         method: 'POST',
//         body: JSON.stringify({
//             email,
//             password
//         })
//     })
//         .then(response => {
//             console.log("save refresh", response.body.refreshToken)
//             saveToken(response.body.refreshToken)
//         })
// }
//
// const logout = () => {
//     return fetchJSONWithToken('/api/auth/login', {
//         method: 'DELETE'
//     })
//         .then(() => {
//             clearToken()
//         })
// }
