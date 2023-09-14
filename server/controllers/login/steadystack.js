const {getEnv} = require("../../services/db");
const {ACLs} = require("../../../src/lib/authHelpers");


async function isSteadyStack(address, enabledCollections) {
    const partner = enabledCollections.find(el=> el.symbol === 'SSTITN')
    const nftsOwned = await fetch(`${getEnv().steadyStackCheck}${address}`);
    const nfts = await nftsOwned.json();
    let selectedNft

    if(nfts?.unstaked?.length > 0) {
        selectedNft = nfts.unstaked[0]
    } else if (nfts?.staked?.length > 0) {
        selectedNft = nfts.staked[0]
    } else {
        return null
    }


    return {
        symbol: partner.symbol,
        multi: partner.multiplier,
        img: partner.imageUri.replace("[ID]", `${selectedNft.tokenId}`),
        img_fallback: partner.logo,
        id: selectedNft.tokenId,
        ACL: ACLs.Partner
    }
}


module.exports = {isSteadyStack}
