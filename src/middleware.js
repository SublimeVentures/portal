import {NextResponse} from 'next/server';
import {verifyID} from "@/lib/authHelpers";

// const allowedOrigins = ['http://localhost:3000/' ]
// const regExp_api = new RegExp("/api/secure");
// if(regExp_app.test(req.nextUrl.pathname)) {
// const regExp_app = new RegExp("/app");
//todo: rate limiter

export async function middleware(req) {

    const {auth} = await verifyID(req, true);
    if (!auth) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next();
}


export const config = {
    matcher: ['/app/:path*']
}
