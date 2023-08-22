const {ACLs} = require("../../src/lib/authHelpers");
const {processUseUpgrade} = require("../queries/upgrade.query");
const {PremiumItemsENUM} = require("../../src/lib/premiumHelper");

async function useUpgrade(user, req) {
    let offerId, upgradeId;

    try {
        offerId = Number(req.params.id)
        upgradeId = Number(req.params.upgrade)

        if(offerId !== PremiumItemsENUM.Guaranteed && offerId !== PremiumItemsENUM.Increased) {
            throw new Error("Wrong Upgrade")
        }

    } catch(e) {
        return {
            ok:false
        }
    }

    const {ACL, address ,id} = user
    const owner = ACL === ACLs.Whale ? id : address

    const data = await processUseUpgrade(owner, offerId, upgradeId)
    console.log("Data",data)
    //todo: impact investment

    return data
}


module.exports = {useUpgrade}
