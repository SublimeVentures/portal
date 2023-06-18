// import {createContext, useContext, useState} from 'react';
// import {fetch} from "@/lib/fetchHandler";
// // import {fetchWrapper} from "@/lib/requests/fetchWrapper";
//
// const AuthContext = createContext({
//     user: null,
//     accessToken: null,
//     login: () => {},
//     refresh: () => {},
//     test: () => {},
//     // logout: async () => {},
// })
//
// //todo: replace for env context
//
// export const AuthContextProvider = ({children, session}) => {
//     const [user, setUser] = useState(null)
//     // const [accessToken, setAccessToken] = useState(null)
//
//     const login = async () => {
//         const response = await fetch('/api/auth/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//         })
//         const parsed = await response.json()
//         console.log("post - parsed",parsed)
//         // setAccessToken(parsed.accessToken)
//         setUser(parsed.user)
//         localStorage.setItem("refresh", parsed.refreshToken);
//     }
//
//     // const test = async () => {
//     //     const response = await fetch('/api/secure/test', {
//     //         method: 'GET',
//     //         mode: 'no-cors',
//     //         headers: { 'Content-Type': 'application/json' },
//     //         credentials: "include",
//     //     })
//     //     // const parsed = await response.json()
//     //     // console.log("post - parsed",parsed)
//     //     // setAccessToken(parsed.accessToken)
//     // }
//     // const refresh = async () => {
//     //     const response = await fetch('/api/auth/login', {
//     //         method: 'PUT',
//     //         headers: {
//     //             'Content-Type': 'application/json',
//     //             'x-refresh': localStorage.getItem("refresh")
//     //         },
//     //     })
//     //     const parsed = await response.json()
//     //     console.log("refresh - parsed",parsed)
//     //     setUser(parsed.user)
//     //     localStorage.setItem("refresh", parsed.refreshToken);
//     // }
//
//     //todo: fetch tokens
//     //todo: logout
//     //todo: fetch data and decode
//
//     // const login = () => {}
//     let contextData = {
//         user,
//         login,
//         // refresh,
//         test
//         // accessToken
//         // authTokens:authTokens,
//         // setAuthTokens:setAuthTokens,
//         // loginUser:loginUser,
//         // logoutUser:logoutUser,
//     }
//
//     console.log("AuthContextProvider - PRINT", contextData)
//
//
//     return (
//         <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
//     )
// }
//
// //in different file
// //const val = useContext(AuthContext)
// export const useAuthContext = () => useContext(AuthContext);
