const {serialize} = require("cookie");
const {jwtVerify, SignJWT} = require("jose")
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const {ethers} = require("ethers");

const aws_secrets = new SecretsManagerClient({ region: process.env.SECRET_REGION });
const aws_secrets_input = { // GetSecretValueRequest
    SecretId: process.env.SECRET_NAME,
};


const ACLs = {
    Whale: 0,
    Member: 1,
    NeoTokyo: 2,
    Partner: 3,
    PartnerInjected: 4,
    Delegated: 5,
    Admin: 6
}

const OfferAccess = {
    Whales: 0, //only for whales
    BasedVC: 1, //for whales and basedVC exclusive
    NeoTokyo: 3,
    Everyone: 4,
    EveryoneWithoutNT: 5,
    OnlyDev: 6
}

const OfferAccessACL = {
    [ACLs.Admin]: {
        [OfferAccess.Whales]: true,
        [OfferAccess.BasedVC]: true,
        [OfferAccess.Everyone]: true,
        [OfferAccess.EveryoneWithoutNT]: true,
        [OfferAccess.OnlyDev]: true,
        [OfferAccess.NeoTokyo]: true,
    },
    [ACLs.Whale]: {
        [OfferAccess.Whales]: true,
        [OfferAccess.BasedVC]: true,
        [OfferAccess.Everyone]: true,
        [OfferAccess.EveryoneWithoutNT]: true,
    },
    [ACLs.Member]: {
        [OfferAccess.BasedVC]: true,
        [OfferAccess.Everyone]: true,
        [OfferAccess.EveryoneWithoutNT]: true,
    },
    [ACLs.NeoTokyo]: {
        [OfferAccess.NeoTokyo]: true,
        [OfferAccess.Everyone]: true,
    },
    [ACLs.Partner]: {
        [OfferAccess.Everyone]: true,
        [OfferAccess.EveryoneWithoutNT]: true,
    }
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
        secure: process.env.ENV === "production",
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

const getPrivateKeyFromAWSSecretManager = async () => {
    try {
        const response = await aws_secrets.send(
            new GetSecretValueCommand({
                SecretId: process.env.SECRET_NAME,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
        return response.SecretString
    } catch (err) {
        console.log(`AWS SecretsManager Read Error: ${err}`);
        throw err;
    }
}

const signData = async (wallet, otcId, dealId, nonce, expire) => {
    try {
        if (!Number.isInteger(otcId) || !Number.isInteger(dealId)) throw new Error("Invalid IDs");

        const privateKeyHex = await getPrivateKeyFromAWSSecretManager();

        const signer = new ethers.Wallet(privateKeyHex);
        const combinedMessage = ethers.utils.solidityPack(["uint256", "uint256", "uint256",  "uint256", "address"], [otcId, dealId, nonce, expire, wallet]);

        const payloadHash = ethers.utils.keccak256(combinedMessage);

        return {
            ok: true,
            data: await signer.signMessage(ethers.utils.arrayify(payloadHash))
        };
    } catch (e) {
        console.log("signature error" ,e)

        return {
            ok: false,
            error: e
        }
    }
}


module.exports = {
    ACLs,
    OfferAccess,
    OfferAccessACL,
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
    signData
}
