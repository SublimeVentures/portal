const {checkAcl} = require("./acl");
const {getUserInvestment, getUserInvestments, getUserInvestmentsExpanded} = require("../queries/investment");


async function userInvestment(session, req) {
    const {ACL, ADDRESS, USER} = checkAcl(session, req)

    const owner = ACL === 0 ? USER.id : ADDRESS

    const offerId = Number(req.query.offer)
    return await getUserInvestment(owner, offerId)
}

async function userInvestments(session, req) {
    const {ACL, ADDRESS, USER} = checkAcl(session, req)
    const owner = ACL === 0 ? USER.id : ADDRESS
    return await getUserInvestmentsExpanded(owner)
}



module.exports = {userInvestment, userInvestments}
