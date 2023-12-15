const {ACLs} = require("../../../../src/lib/authHelpers");
const {getPartnerAvatar} = require("../helper");

async function loginEthlizards(nfts) {
    const partnersFiltered = nfts.filter(el => el.partnerDetails.level === 15)
    if(partnersFiltered.length===0) return;

    const genesis = partnersFiltered.find(el => el.partnerDetails.symbol == 'LIZARD')
    const venture = partnersFiltered.find(el => el.partnerDetails.symbol == 'LIZARD_V')
    const locked = partnersFiltered.filter(el => el.partnerDetails.symbol == 'LLZ')

    let selected, multiplier;
    if(genesis) {
        selected = genesis
        multiplier = selected.partnerDetails.multiplier
    } else if(locked) {
        const locked_venture = locked.find(el=> Number(el.token_id) < 5050)
        const locked_genesis = locked.find(el=> Number(el.token_id) >= 5050)
        if(locked_genesis) {
            selected = locked_genesis
            multiplier = selected.partnerDetails.metadataVal["Genesis"]
        } else {
            selected = locked_venture
            multiplier = selected.partnerDetails.metadataVal["Venture"]
        }
    } else {
        selected = venture
        multiplier = selected.partnerDetails.multiplier
    }

    if(!selected) return
    const tokenId = Number(selected.token_id)
    const image = await getPartnerAvatar(tokenId, selected.partnerDetails)


    return {
        symbol: selected.partnerDetails.symbol,
        multi: multiplier,
        img: image,
        img_fallback: selected.partnerDetails.logo,
        id: tokenId,
        ACL: ACLs.Partner
    }
}


module.exports = {loginEthlizards}
