const {ACLs} = require("../../src/lib/authHelpers");
const {getUserLootbox} = require("../queries/lootbox.query");


async function getLootbox(user) {
    const {address, ACL, id} = user
    const owner = ACL === ACLs.Whale ? `${id}` : address

    const result =  await getUserLootbox(owner, false)
    return result
}



module.exports = {getLootbox}
