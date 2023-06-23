const {serialize} = require("cookie");
const {jwtVerify, SignJWT} = require("jose")

const ACLs = {
    Whale: 0,
    NeoTokyo: 1,
    Partner: 2,
    PartnerInjected: 3,
    Delegated: 4,
}

const domain = new URL(process.env.DOMAIN)
const userIdentification = 'address'
const JWT_REFRESH_SECRET_encode = new TextEncoder().encode(
    process.env.JWT_REFRESH_SECRET,
)
const JWT_ACCESS_SECRET_encode = new TextEncoder().encode(
    process.env.JWT_SECRET,
)
const alg = 'HS256'
const authTokenName = "x-auth-access"
const refreshTokenName = "x-refresh-access"


const retrieveToken = (name) => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(name)
    } else return null
}
const saveToken = (name, token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(name, token)
    } else return null
}
const clearToken = (name) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(name, null)
    } else return null
}

const generateToken = async (userData, length, encryption) => {
    return await new SignJWT({user: userData})
        .setProtectedHeader({alg})
        .setIssuedAt()
        .setExpirationTime(length)
        .sign(encryption)
}

const buildCookie = (name, content, maxAge) => {
    return serialize(name, content, {
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
        path: '/',
    });
}

const verifyToken = async (token, secret) => {
    const {payload} = await jwtVerify(token, secret)
    if (!payload) throw new Error("Bad JWT")
    return payload
}

const verifyTokenAccess = async (req) =>{
    const token = req.cookies[authTokenName]
    if (token) {
        try {
            const session = await verifyToken(token, JWT_ACCESS_SECRET_encode)
            return {user:session?.user, auth: true}
        } catch (e) {
            if(e.code == "ERR_JWT_EXPIRED") return {auth: false, exists: !!token}
        }
    }
    return {auth: false}
}

const verifyTokenRefresh = async (req) =>{
    const token = req.headers[refreshTokenName]

    if (token) {
        try {
            const session = await verifyToken(token, JWT_REFRESH_SECRET_encode)
            return {user:session?.user, auth: true}
        } catch (e) {
            if(e.code === "ERR_JWT_EXPIRED ") return {auth: false, exists: !!token}
            console.log("AH :: verifyTokenRefresh - FAILED" )
        }
    }
    return {auth: false}
}

const verifyID = async (req, isRefresh) => {
    if (isRefresh) {
        return await verifyTokenRefresh(req)
    } else {
        return await verifyTokenAccess(req)
    }
}

module.exports = {
    ACLs,
    domain,
    userIdentification,
    JWT_REFRESH_SECRET_encode,
    JWT_ACCESS_SECRET_encode,
    authTokenName,
    refreshTokenName,
    retrieveToken,
    saveToken,
    clearToken,
    generateToken,
    buildCookie,
    verifyToken,
    verifyID,
}
//
// 0x9ada21A8bc6c33B49a089CFC1c24545d2a27cD81,https://d3dnznjar52mfe.cloudfront.net/partners/pg.svg,Project Godjira,PG,10,721,true,true,2023-05-24 17:23:17.972000 +00:00,2023-05-24 17:23:19.982000 +00:00,1,5,false,
// 0xEDc3AD89f7b0963fe23D714B34185713706B815b,https://d3dnznjar52mfe.cloudfront.net/partners/pg.svg,Project Godjira - Gen2,PG,10,721,false,true,2023-05-24 17:24:16.623000 +00:00,2023-05-24 17:24:18.103000 +00:00,1,5,false,
// 0xc0e68379A12601596bB091EB58eE4371214f9873,https://d3dnznjar52mfe.cloudfront.net/partners/b3l.png,B3L B3asts,B3ASTS,10,721,true,true,2023-05-24 17:26:31.711000 +00:00,2023-05-24 17:26:32.069000 +00:00,1,5,false,
// 0xFe5E68233fD6de2E405dde432c116F4e41EdF72d,https://d3dnznjar52mfe.cloudfront.net/partners/dl.png,Dark Labs,DL,10,721,true,true,2023-05-24 17:27:49.006000 +00:00,2023-05-24 17:27:49.364000 +00:00,1,5,false,
// 0x84b3840b7F7E8a236Bf92E99f6175f143fA1163A,https://d3dnznjar52mfe.cloudfront.net/partners/vcx.png,Venture Capital X,VCX,10,721,false,true,2023-05-28 14:30:28.206000 +00:00,2023-05-28 14:30:29.627000 +00:00,1,5,false,
// 0x99B4A4d833CccdD7Fa665F874e027978e3eFADBa,https://d3dnznjar52mfe.cloudfront.net/partners/vcx.png,Venture Capital X,VCX,10,721,true,true,2023-05-24 17:25:03.287000 +00:00,2023-05-24 17:25:03.754000 +00:00,1,5,false,
// 0xB9951B43802dCF3ef5b14567cb17adF367ed1c0F,,Neo Tokyo Citizen S1,NTCTZN,15,721,false,true,2023-06-21 17:53:22.004000 +00:00,2023-06-21 17:53:23.556000 +00:00,1,5,true,
// 0xb668beb1fa440f6cf2da0399f8c28cab993bdd65,,Neo Tokyo Citizen S1 (old),NTCTZN,15,721,false,true,2023-06-21 17:54:44.244000 +00:00,2023-06-21 17:54:46.042000 +00:00,1,5,true,
// 0x4481507cc228FA19D203BD42110d679571f7912E,,Neo Tokyo Citizen S2,NTOCTZN,15,721,false,true,2023-06-21 17:56:47.254000 +00:00,2023-06-21 17:56:47.848000 +00:00,1,3,true,
// 0x9b091d2E0Bb88acE4fe8f0faB87b93D8bA932EC4,,Neo Tokyo Citizen S2 (old),NTOCTZN,15,721,false,true,2023-06-21 17:56:47.254000 +00:00,2023-06-21 17:56:47.848000 +00:00,1,3,true,
// 0x6fc3AD6177B07227647aD6b4Ae03cc476541A2a0,https://d3dnznjar52mfe.cloudfront.net/partners/de.png,DarkEchelon,DARK,10,721,true,true,2023-05-24 17:29:19.746000 +00:00,2023-05-24 17:29:20.088000 +00:00,1,0,false,Memberhip Level
// 0xF6ee484f82f28d69688f37fe90Af514ce212b7c3,https://d3dnznjar52mfe.cloudfront.net/partners/ttoo.png,This Thing Of Ours,TTOO,10,721,true,true,2023-05-24 17:21:44.223000 +00:00,2023-05-24 17:21:46.553000 +00:00,1,0,false,Rarity
// 0xd37ea75Dd3c499eDA76304f538CbF356Ed9e7Ed9,,Neo Tokyo Citizen (staked),NTCTZN,15,721,false,true,2023-06-21 17:56:02.243000 +00:00,2023-06-21 17:56:04.256000 +00:00,1,0,true,elites
//
//
//
//
//
// 0x9ada21A8bc6c33B49a089CFC1c24545d2a27cD81,https://d3dnznjar52mfe.cloudfront.net/partners/pg.svg,Project Godjira,PG,10,721,true,true,false,"","",5,2023-05-24 17:23:19.982000 +00:00,2023-05-24 17:23:19.982000 +00:00,1
// 0xEDc3AD89f7b0963fe23D714B34185713706B815b,https://d3dnznjar52mfe.cloudfront.net/partners/pg.svg,Project Godjira - Gen2,PG,10,721,false,true,false,"","",5,2023-05-24 17:24:18.103000 +00:00,2023-05-24 17:24:18.103000 +00:00,1
// 0xc0e68379A12601596bB091EB58eE4371214f9873,https://d3dnznjar52mfe.cloudfront.net/partners/b3l.png,B3L B3asts,B3ASTS,10,721,true,true,false,"","",5,2023-05-24 17:26:32.069000 +00:00,2023-05-24 17:26:32.069000 +00:00,1
// 0xFe5E68233fD6de2E405dde432c116F4e41EdF72d,https://d3dnznjar52mfe.cloudfront.net/partners/dl.png,Dark Labs,DL,10,721,true,true,false,"","",5,2023-05-24 17:27:49.364000 +00:00,2023-05-24 17:27:49.364000 +00:00,1
// 0x84b3840b7F7E8a236Bf92E99f6175f143fA1163A,https://d3dnznjar52mfe.cloudfront.net/partners/vcx.png,Venture Capital X,VCX,10,721,false,true,false,"","",5,2023-05-28 14:30:29.627000 +00:00,2023-05-28 14:30:29.627000 +00:00,1
// 0x99B4A4d833CccdD7Fa665F874e027978e3eFADBa,https://d3dnznjar52mfe.cloudfront.net/partners/vcx.png,Venture Capital X,VCX,10,721,true,true,false,"","",5,2023-05-24 17:25:03.754000 +00:00,2023-05-24 17:25:03.754000 +00:00,1
// 0xB9951B43802dCF3ef5b14567cb17adF367ed1c0F,,Neo Tokyo Citizen S1,NTCTZN,15,721,false,true,false,"","",5,2023-06-21 17:53:23.556000 +00:00,2023-06-21 17:53:23.556000 +00:00,1
// 0xb668beb1fa440f6cf2da0399f8c28cab993bdd65,,Neo Tokyo Citizen S1 (old),NTCTZN,15,721,false,true,false,"","",5,2023-06-21 17:54:46.042000 +00:00,2023-06-21 17:54:46.042000 +00:00,1
// 0x4481507cc228FA19D203BD42110d679571f7912E,,Neo Tokyo Citizen S2,NTOCTZN,15,721,false,true,false,"","",3,2023-06-21 17:56:47.848000 +00:00,2023-06-21 17:56:47.848000 +00:00,1
// 0x9b091d2E0Bb88acE4fe8f0faB87b93D8bA932EC4,,Neo Tokyo Citizen S2 (old),NTOCTZN,15,721,false,true,false,"","",3,2023-06-21 17:56:47.848000 +00:00,2023-06-21 17:56:47.848000 +00:00,1
// 0x6fc3AD6177B07227647aD6b4Ae03cc476541A2a0,https://d3dnznjar52mfe.cloudfront.net/partners/de.png,DarkEchelon,DARK,10,721,true,true,false,"","",0,2023-05-24 17:29:20.088000 +00:00,2023-05-24 17:29:20.088000 +00:00,1
// 0xF6ee484f82f28d69688f37fe90Af514ce212b7c3,https://d3dnznjar52mfe.cloudfront.net/partners/ttoo.png,This Thing Of Ours,TTOO,10,721,true,true,false,"","",0,2023-05-24 17:21:46.553000 +00:00,2023-05-24 17:21:46.553000 +00:00,1
// 0xd37ea75Dd3c499eDA76304f538CbF356Ed9e7Ed9,,Neo Tokyo Citizen (staked),NTCTZN,15,721,false,true,false,"","",0,2023-06-21 17:56:04.256000 +00:00,2023-06-21 17:56:04.256000 +00:00,1
