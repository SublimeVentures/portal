import { NextResponse } from 'next/server';

const regExp_api = new RegExp("/api");
const allowedOrigins = ['http://localhost:3000' ]

const apiCorsOk = (request) => {
    const origin = request.headers.get('origin')
    return !(origin && !allowedOrigins.includes(origin) || !origin);
}

const checkJWT = (request) => {
    const { cookies } = request
    const jwt = cookies?.JWT
    console.log("cookie", jwt)

    // const authorizationToken = req.headers.authorization;
    // if (authorizationToken) {
    //     // If the token is expired jwt.verify will throw a error
    //     const data = jwt.verify(authorizationToken, jwtSecretKey);
    //     // Attaching the authenticated data to the request object
    //     req.auth_data = data;
    //     return handler(req, res);
    // }

    return jwt
}

export async function middleware(request) {
    if(regExp_api.test(request.nextUrl.pathname)) {
        if(!apiCorsOk(request)) {
            return new NextResponse(null, {
                status: 400,
                statusText:'Bad Request',
                headers: {
                    'Content-Type': 'text/plain'
                }
            })
        }
        //
        // if(!checkJWT(request)) {
        //     return new NextResponse(null, {
        //         status: 401,
        //         statusText:'Not authorized',
        //         headers: {
        //             'Content-Type': 'text/plain'
        //         }
        //     })
        // }
    }

    //todo: consider query with cookie and without it!
    //todo: protected & non public routes
    //todo: rate limiter
    //return NextResponse.redirect(new URL('/dashboard', req.url))
    return NextResponse.next();
}

//
// export const config = {
//     matcher: ['/dashboard', '/login']
// }



//todo: store JWT access_token in session cookie
//todo: store JWT refresh_token in session cookie
//todo: attach
//todo: store refresh tokens in memory


//todo: po zalogowaniu wyślij access_token ważny 15min i refresh_token ważny dzień
//todo: na expired access_token, poproś o nowy z refresh_token i access_token
//todo: refresh_token trzymaj w pamięci appki - po wykorzystaniu usuń
//todo: zrób call z nowym access_token
//todo: do każdego response dołóż obiekt usera ??
