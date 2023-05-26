const {checkAcl} = require("./acl");
const {getUserVault, getUserInvestment} = require("../queries/vaults.query");
const {getEnv} = require("../services/db/utils");


async function userInvestment(session, req) {
    const {ACL, ADDRESS, USER} = checkAcl(session, req)
    const owner = ACL === 0 ? `${USER.id}` : ADDRESS

    const offerId = Number(req.query.offer)
    const result =  await getUserInvestment(owner, offerId)
    return result?.invested ? result.invested : 0
}

async function userVault(session, req) {
    const {ACL, ADDRESS, USER} = checkAcl(session, req)
    const owner = ACL === 0 ? `${USER.id}` : ADDRESS
    const vault = await getUserVault(owner)
    return {elements: vault, research: getEnv().research}
}



module.exports = {userInvestment, userVault}
