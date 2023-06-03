// export {default} from "next-auth/middleware"
import {withAuth} from "next-auth/middleware"
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {

        console.log("MIDDLEWARE - REQ", req)
        console.log("MIDDLEWARE - REQ split", req.nextUrl.href.split('/app'))
        // const response = NextResponse.next();
        // return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL));
    },
    {
        callbacks: {
            authorized: ({ req, token }) => { //middleware runs only with callback = true
                console.log("MIDDLEWARE - token", token)
                return !token?.address
            },
        },
    }
)

// export function middleware(request: NextRequest) {
//     if (request.nextUrl.pathname.startsWith('/about')) {
//         return NextResponse.rewrite(new URL('/about-2', request.url));
//     }
//
//     if (request.nextUrl.pathname.startsWith('/dashboard')) {
//         return NextResponse.rewrite(new URL('/dashboard/user', request.url));
//     }
// }

export const config = {matcher: ["/app/:path*"]}
