const {
    generateToken,
    JWT_ACCESS_SECRET_encode,
    JWT_REFRESH_SECRET_encode,
    buildCookie,
    authTokenName,
    userIdentification
} = require("../../../src/lib/authHelpers");

let REFRESH_TOKENS = {}

const getRefreshToken = (id) => {
    return REFRESH_TOKENS[id]
}

const setRefreshToken = (id, data) => {
    REFRESH_TOKENS[id] = data
}
const deleteRefreshToken = (id) => {
    delete REFRESH_TOKENS[id]
}

const refreshAuth = async (userData, updatedSession) => {
    const finalData = {...userData, ...updatedSession}
    const accessToken = await generateToken(finalData, '15m', JWT_ACCESS_SECRET_encode)
    const refreshToken = await generateToken(finalData.address, '12h', JWT_REFRESH_SECRET_encode)
    const accessCookie = buildCookie(authTokenName, accessToken, 15 * 60 * 1000)
    setRefreshToken(finalData[userIdentification], {
        refreshToken,
        userData: finalData,
    })

    return {
        data: {refreshToken, updatedSession},
        cookie: accessCookie
    }

}

module.exports = {
    setRefreshToken,
    getRefreshToken,
    deleteRefreshToken,
    refreshAuth
}
