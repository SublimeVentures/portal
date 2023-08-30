const {ACLs} = require("../../src/lib/authHelpers");
const {processUseUpgrade, fetchUpgrade} = require("../queries/upgrade.query");
const {PremiumItemsENUM} = require("../../src/lib/premiumHelper");

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

    const {ACL, address ,id} = user
    const owner = address
    // const owner = ACL === ACLs.Whale ? id : address

    const data = await processUseUpgrade(owner, offerId, upgradeId)
    console.log("Data",data)
    //todo: impact investment

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

    const {ACL, address ,id} = user
    const owner = address
    // const owner = ACL === ACLs.Whale ? id : address
    return {ok: true, data: await fetchUpgrade(owner, offerId)}

}


module.exports = {useUpgrade, getUpgrades}
