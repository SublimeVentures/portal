export {default} from "next-auth/middleware"

export const config = { matcher: ["/app/:path*"]}

export function middleware(request) {
    console.log("MIDDLEWARE", request)
}

