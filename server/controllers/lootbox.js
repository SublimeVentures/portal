const {ACLs} = require("../../src/lib/authHelpers");
const {openMysterybox} = require("../queries/mysterybox.query");


async function claim(user) {
    const {address, ACL, id} = user
    const owner = ACL === ACLs.Whale ? `${id}` : address

    const result =  await openMysterybox(owner)
    return result
}



module.exports = {claim}
