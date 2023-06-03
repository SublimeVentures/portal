// export {default} from "next-auth/middleware"
import {withAuth} from "next-auth/middleware"
import { NextResponse } from 'next/server';
const sessionName = process.env.FORCE_DEV === "true" ? "next-auth.session-token" : (process.env.ENV === "production" ? "__Secure-next-auth.callback-url" : "next-auth.callback-url")

export default withAuth(
    function middleware(req) {

        console.log("MIDDLEWARE - REQ", req)
        // const forbiddenURL = req.nextUrl.href.split('/app')[1]
        // const redirect = forbiddenURL ? forbiddenURL : "/"
        const url = req.cookies.get('next-auth.callback-url')?.value;
        const callback = req.nextUrl.href.replace(req.nextUrl.origin, '')
        console.log("MIDDLEWARE - REQ redirect", callback)
        // const response = NextResponse.next();
        return NextResponse.redirect(new URL(`/login?callbackUrl=${process.env.NEXTAUTH_URL}${callback}`, process.env.NEXTAUTH_URL));
    },
    {
        callbacks: {
            authorized: ({ req, token }) => { //middleware runs only with callback = true
                console.log("MIDDLEWARE - token", token, !token?.user?.address)
                req.token = token
                return !!token
            },
        },
    }
)


export const config = {matcher: ["/app/:path*"]}
