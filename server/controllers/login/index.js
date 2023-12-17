const {recoverMessageAddress} = require('viem')

const {
    buildCookie,
    domain,
    userIdentification
} = require("../../../src/lib/authHelpers");
const {authTokenName} = require("../../../src/lib/authHelpers");
const {isBased} = require("../../../src/lib/utils");
const {getEnv} = require("../../services/db");
const {getWeb3} = require("../../services/web3");

const {loginNeoTokyo} = require("./neotokyo");
const {getPartners} = require("../../queries/partners.query");
const {loginBased} = require("./based");
const {getRefreshToken, deleteRefreshToken, refreshAuth} = require("./tokens");
const {userWalletUpsert} = require("../../queries/user.query");
const logger = require("../../../src/lib/logger");
const {serializeError} = require("serialize-error");


const validateLogin = async (message, signature) => {
    try {
        const recoveredAddress = await recoverMessageAddress({
            message: message,
            signature: signature,
        })

        const validDomain = message.split('\n')[3].split('DOMAIN: ')[1] === domain.host
        if (!validDomain) return false;

        // const userSession = await buildSession(recoveredAddress)
        // if (!userSession) return false;
        // return {...{address: recoveredAddress}, ...userSession}

        const fakeAddress="0xEAE679eA220E6be182E25A8C2B49f92a174C0982" //todo:
        const userSession = await buildSession(fakeAddress)
        console.log("userSession",userSession, fakeAddress)
        if (!userSession) return false;
        return {...{address: fakeAddress}, ...userSession}
    } catch (error) {
        logger.error(`ERROR :: Server listener`, {error: serializeError(error)});
        return null
    }
}



const logIn = async (req) => {
    const userData = await validateLogin(req.body.message, req.body.signature)
    if(!userData)  return null;
    return await refreshAuth(userData)
}


const refreshToken = async (user) => {
    try {
        const session = getRefreshToken(user)
        deleteRefreshToken(user)
        if (user !== session.userData[userIdentification]) {
            throw new Error("data not match")
        }
        return await refreshAuth(session.userData)
    } catch (e) {
        return null
    }
}

const logOut = async (user) => {
    deleteRefreshToken(user[userIdentification])
    return buildCookie(authTokenName, null, -1)
}

async function feedUserNfts(address) {
    const enabledCollections = await getPartners(getEnv().isDev, isBased)
    let userNfts = []
    for (const chain of getWeb3().chains) {
        const searchFor = enabledCollections.filter(el => el.chainId === chain._chainlistData.chainId && el.erc === 721)
        if (searchFor.length > 0) {
            const tokenAddresses = searchFor.map(el => el.address)
            let cursor = undefined;
            let moreResults = true;
            while (moreResults) {
                const { jsonResponse } = await getWeb3().query.EvmApi.nft.getWalletNFTs({
                    chain,
                    address,
                    cursor, // pass the cursor for pagination
                    tokenAddresses,
                    format: "decimal",
                    normalizeMetadata: true,
                    disableTotal: true,
                    mediaItems: true,
                });
                userNfts = [...userNfts, ...jsonResponse.result]
                cursor = jsonResponse.cursor; // update cursor with the new value
                moreResults = !!cursor; // continue loop if there's a next page
            }
        }
    }
    return [userNfts, enabledCollections]
}


async function buildSession(address) {
    const [nfts, partners] = await feedUserNfts(address)
    let type = isBased ? await loginBased(nfts, partners, address) : await loginNeoTokyo(nfts, partners, address)

    if(!!type) {
        const user = await userWalletUpsert(address, type.ACL)
        type.userId = user.id
    }

    return type
}

module.exports = {
    logOut,
    refreshToken,
    logIn,
}
