const {ACLs} = require("../../../../src/lib/authHelpers");
const {getPartnerAvatar} = require("../helper");

async function loginEthlizards(nfts) {
    const partnersFiltered = nfts.filter(el => el.partnerDetails.level === 15)
    if(partnersFiltered.length===0) return;

    const genesis = partnersFiltered.filter(el => el.partnerDetails.symbol == 'LIZARD')
    const venture = partnersFiltered.filter(el => el.partnerDetails.symbol == 'LIZARD_V')
    const locked = partnersFiltered.filter(el => el.partnerDetails.symbol == 'LLZ')

    let selected
    let multiplier = 0;

    if(venture.length>0) {
        selected = venture[0]
        multiplier += selected.partnerDetails.multiplier * venture.length
    }
    if(locked.length>0) {
        const locked_venture = locked.filter(el=> Number(el.token_id) < 5050)
        const locked_genesis = locked.filter(el=> Number(el.token_id) >= 5050)
        if(locked_venture.length > 0) {
            selected = locked_venture[0]
            multiplier += selected.partnerDetails.metadataVal["Venture"] * locked_venture.length
        }
        if (locked_genesis.length > 0) {
            selected = locked_genesis[0]
            multiplier += selected.partnerDetails.metadataVal["Genesis"] * locked_genesis.length
        }
    }

    if(genesis.length>0) {
        selected = genesis[0]
        multiplier += selected.partnerDetails.multiplier * genesis.length
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
