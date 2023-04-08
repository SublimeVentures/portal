import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getCsrfToken } from "next-auth/react"
import { SiweMessage } from "siwe"
import {fetchPublicInvestments} from "@/fetchers/login";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
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
                    const csrf = req.cookies['next-auth.csrf-token'].split("|")[0]

                    //todo: test in prod
                    // const csrf = await getCsrfToken({req})

                    const result = await siwe.verify({
                        signature: credentials?.signature || "",
                        domain: nextAuthUrl.host,
                        nonce: csrf,
                    })
                    if (result.success) {
                        const type = await fetchPublicInvestments(siwe.address)
                        return {
                            id: siwe.address,
                            type:type,
                        }
                    }
                    return null

                } catch (e) {
                    return null
                }
            },
        }),
    ]

    const isDefaultSigninPage =
        req.method === "GET" && req.query.nextauth.includes("signin")

    // Hide Sign-In with Ethereum from default sign page
    if (isDefaultSigninPage) {
        providers.pop()
    }

    return await NextAuth(req, res, {
        // https://next-auth.js.org/configuration/providers/oauth
        providers,
        session: {
            strategy: "jwt",
        },
        pages:{
          signIn:'/login',
          signOut:'/',
        },
        secret: process.env.NEXTAUTH_SECRET,
        callbacks: {
            jwt: async ({ token, user, type, id }) => {
                console.log("jwt", token, user, type, id)
                user && (token.user = user)
                return token
            },
            async session({ session, token }) {
                console.log("session", session)
                console.log("token", token)
                //todo: tutaj dodawaja dodatkoe dane
                session.user.address = token.sub
                session.address = token.sub
                return session
            },
        },
    })
}
