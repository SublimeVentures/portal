const {checkAcl} = require("./acl");
const {getUserInvestment, getUserInvestments} = require("../queries/investment");


async function userInvestment(session, req) {
    const {ACL, ADDRESS, USER} = checkAcl(session, req)
    console.log("userInvestment - acl",ACL, ADDRESS, USER.id)

    const owner = ACL === 0 ? USER.id : ADDRESS
    console.log("userInvestment - owner",owner)

    const offerId = Number(req.query.offer)
    const investment = await getUserInvestment(owner, offerId)
    console.log("offerId ",offerId, investment)
    return investment
}

async function userInvestments(session, req) {
    const {ACL, ADDRESS, id} = checkAcl(session, req)
    const owner = ACL === 0 ? id : ADDRESS
    const investments = getUserInvestments(owner)
    return {investments}
}



module.exports = {userInvestment, userInvestments}
