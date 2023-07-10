const {getUserVault, getUserInvestment} = require("../queries/vaults.query");
const {getEnv} = require("../services/db");


async function userInvestment(user, req) {
    const {ACL, address, id} = user
    const owner = ACL === 0 ? `${id}` : address

    const offerId = Number(req.query.offer)
    const result =  await getUserInvestment(owner, offerId)
    return result?.invested ? result.invested : 0
}

async function userVault(user) {
    const {ACL, address, id} = user
    const owner = ACL === 0 ? `${id}` : address
    const vault = await getUserVault(owner)
    return {elements: vault, cdn: getEnv().cdn}
}



module.exports = {userInvestment, userVault}
