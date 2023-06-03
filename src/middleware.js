export {default} from "next-auth/middleware"
// import { withAuth } from "next-auth/middleware"

// export function middleware(request) {
//     console.log("MIDDLEWARE", request)
// }

export const config = { matcher: ["/app/:path*"]}
