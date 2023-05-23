const {checkAcl} = require("./acl");
const {getUserVault, getUserInvestment} = require("../queries/vaults.query");


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
    return await getUserVault(owner)
}



module.exports = {userInvestment, userVault}
