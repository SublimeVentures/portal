const {ACLs} = require("../../../../src/lib/authHelpers");
const {getPartnerAvatar} = require("../helper");

function getTierByAmount(tiers, amount) {
    let selectedTier = null;

    // Convert the keys to numbers since they are string in the JSON object
    const keys = Object.keys(tiers).map(Number).sort((a, b) => a - b);

    for (const key of keys) {
        if (amount >= key) {
            selectedTier = tiers[key];
        } else {
            break;
        }
    }

    return selectedTier;
}


async function loginNexus(nfts, partners) {
    const partnerFiltered = partners.find(el => el.level === 14)
    if(!partnerFiltered) return false;

    const getTier = getTierByAmount(partnerFiltered.metadataVal, nfts.length)

    return {
        symbol: partnerFiltered.symbol,
        multi: getTier[partnerFiltered.metadataProp],
        img: await getPartnerAvatar(null, partnerFiltered),
        img_fallback: partnerFiltered.logo,
        id: getTier.tier,
        ACL: ACLs.Partner
    }
}


module.exports = {loginNexus}
