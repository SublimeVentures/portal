const {ACLs} = require("../../src/lib/authHelpers");
const {processUseUpgrade, fetchUpgrade} = require("../queries/upgrade.query");
const {PremiumItemsENUM} = require("../../src/lib/enum/store");

async function useUpgrade(user, req) {
    let offerId, upgradeId;

    try {
        offerId = Number(req.params.id)
        upgradeId = Number(req.params.upgrade)

        if(upgradeId !== PremiumItemsENUM.Guaranteed && upgradeId !== PremiumItemsENUM.Increased) {
            throw new Error("Wrong Upgrade")
        }

    } catch(e) {
        console.log("erro",e)
        return {
            ok:false
        }
    }

    const {ACL, address ,id, multi} = user
    const owner = ACL === ACLs.Whale ? id : address
    const data = await processUseUpgrade(owner, offerId, upgradeId, id, ACL, multi)
    console.log("Data",data)

    return data
}

async function getUpgrades(user, req) {
    let offerId
    try {
        offerId = Number(req.params.id)

    } catch(e) {
        console.log("erro",e)
        return {
            ok:false,
            usedUpgrades: {}
        }
    }

    const { userId} = user
    return {ok: true, data: await fetchUpgrade(userId, offerId)}

}


module.exports = {useUpgrade, getUpgrades}
