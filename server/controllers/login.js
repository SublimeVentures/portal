const {recoverMessageAddress} = require('viem')

const {
    buildCookie,
    domain,
    generateToken,
    JWT_ACCESS_SECRET_encode,
    JWT_REFRESH_SECRET_encode,
    userIdentification
} = require("../../src/lib/authHelpers");
const {authTokenName} = require("../../src/lib/authHelpers");
const {checkUser, checkStaking} = require("./loginProcess");

let REFRESH_TOKENS = {}

const validateLogin = async (message, signature) => {
    try {
        const recoveredAddress = await recoverMessageAddress({
            message: message,
            signature: signature,
        })

        const validDomain = message.split('\n')[3].split('DOMAIN: ')[1] === domain.host
        if (!validDomain) return false;

        const userSession = await checkUser(recoveredAddress)
        if (!userSession) return false;
        return {...{address: recoveredAddress}, ...userSession}
        // const fakeAddress="0x34A66192320Db9e0e91e2E238eA956249dA1bF71"
        // const userSession = await checkUser(fakeAddress)
        // console.log("userSession",userSession)
        // if (!userSession) return false;
        // return {...{address: fakeAddress}, ...userSession}
    } catch (e) {
        console.log("validateLogin", e)
        return null
    }
}

const refreshAuth = async (userData, updatedSession) => {
    const finalData = {...userData, ...updatedSession}
    const accessToken = await generateToken(finalData, '15m', JWT_ACCESS_SECRET_encode)
    const refreshToken = await generateToken(finalData.address, '12h', JWT_REFRESH_SECRET_encode)
    const accessCookie = buildCookie(authTokenName, accessToken, 15 * 60 * 1000)

    REFRESH_TOKENS[finalData[userIdentification]] = {
        refreshToken,
        userData: finalData,
    }

    return {
        data: {refreshToken, updatedSession},
        cookie: accessCookie
    }

}

const logIn = async (req) => {
    const userData = await validateLogin(req.body.message, req.body.signature)
    if(!userData)  return null;
    return await refreshAuth(userData)
}

const updateSession_CitCapStaking = async (user) => {
    try {
        const session = REFRESH_TOKENS[user]
        delete REFRESH_TOKENS[user];
        if (user !== session.userData[userIdentification]) {
            throw new Error("data not match")
        }
        const {isStaked, stakeSize, stakeDate} = await checkStaking(user)
        return await refreshAuth(session.userData, {isStaked, stakeSize, stakeDate})
    } catch (e) {
        return null
    }
}

const refreshToken = async (user) => {
    try {
        const session = REFRESH_TOKENS[user]
        delete REFRESH_TOKENS[user];
        if (user !== session.userData[userIdentification]) {
            throw new Error("data not match")
        }
        return await refreshAuth(session.userData)
    } catch (e) {
        return null
    }
}

const logOut = async (user) => {
    delete REFRESH_TOKENS[user[userIdentification]];
    return buildCookie(authTokenName, null, -1)
}


module.exports = {
    logOut,
    refreshToken,
    logIn,
    updateSession_CitCapStaking
}
