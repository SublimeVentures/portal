const {getUserVault, getUserInvestment} = require("../queries/vaults.query");
const {getEnv} = require("../services/db");


async function userInvestment(user, req) {
    const {userId} = user

    const offerId = Number(req.query.offer)
    const result =  await getUserInvestment(userId, offerId)
    return result?.invested ? result.invested : 0
}

async function userVault(user) {
    const {userId} = user
    const vault = await getUserVault(userId)
    return {elements: vault, cdn: getEnv().cdn}
}



module.exports = {userInvestment, userVault}
