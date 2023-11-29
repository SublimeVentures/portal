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


async function loginNexus(nfts) {
    const partnerFiltered = nfts.filter(el => el.partnerDetails.level === 14)
    if(!partnerFiltered) return false;

    const partner = partnerFiltered[0].partnerDetails
    const getTier = getTierByAmount(partner.metadataVal, partnerFiltered.length)

    return {
        symbol: partner.symbol,
        multi: getTier[partner.metadataProp],
        img: await getPartnerAvatar(null, partner),
        img_fallback: partner.logo,
        id: getTier.tier,
        ACL: ACLs.Partner
    }
}


module.exports = {loginNexus}
