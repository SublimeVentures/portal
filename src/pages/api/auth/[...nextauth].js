import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {SiweMessage} from "siwe"
import {fetchSessionData} from "@/fetchers/login.fetcher";
import PAGE from "@/routes";
const meta = process.env.URL === "localhost:3000" ? "next-auth.csrf-token" : "__Host-next-auth.csrf-token"

export default async function auth(req, res) {
    const providers = [
        CredentialsProvider({
            name: "Ethereum",
            credentials: {
                message: {
                    label: "Message",
                    type: "text",
                    placeholder: "0x0",
                },
                signature: {
                    label: "Signature",
                    type: "text",
                    placeholder: "0x0",
                },
            },
            async authorize(credentials) {
                try {
                    const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
                    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)
                    const csrf = req.cookies[meta].split("|")[0]
                    const result = await siwe.verify({
                        signature: credentials?.signature || "",
                        domain: nextAuthUrl.host,
                        nonce: csrf,
                    })

                    if (!result.success) return null;
                    const type = await fetchSessionData(siwe.address)

                    if (type) {
                        return {...{address: siwe.address}, ...type}
                    } else {
                        return null
                    }

                } catch (e) {
                    console.log("login error",e)
                    return null
                }
            },
        }),
    ]

    const isDefaultSigninPage =
        req.method === "GET" && req.query.nextauth.includes("signin")
    if (isDefaultSigninPage) {
        providers.pop()
    }

    return await NextAuth(req, res, {
        secret: process.env.NEXTAUTH_SECRET,
        providers,
        session: {
            strategy: "jwt",
        },
        pages: {
            signIn: PAGE.Login,
            signOut: PAGE.Landing,
        },
        callbacks: {
            jwt: async ({token, user}) => {
                user && (token.user = user)
                return token
            },
            session: async ({session, token}) => {
                session.user = token.user
                return session
            }
            // jwt: async ({ token, account, profile }) => {
            //     console.log("jwt", token, account, profile)
            //     if (account) {
            //         token.accessToken = account.access_token
            //         token.id = profile?.id
            //     }
            //     return token
            // },
            // async session({ session, token }) {
            //     console.log("session", session)
            //     console.log("token", token)
            //     tutaj dodawaja dodatkoe dane
            //     session.user.address = token.sub
            //     session.address = token.sub
            //     return session
            // },
        },
    })
}
