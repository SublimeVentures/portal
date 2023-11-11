const {getEnv} = require("../../../services/db");
const {ACLs} = require("../../../../src/lib/authHelpers");


async function loginSteadyStack(enabledCollections, address) {
    const partner = enabledCollections.find(el=> el.level === 13)
    const nftsOwned = await fetch(`${getEnv().steadyStackCheck}${address}`);
    const nfts = await nftsOwned.json();
    let selectedNft

    if(nfts?.unstaked?.length > 0) {
        selectedNft = nfts.unstaked[0]
    } else if (nfts?.staked?.length > 0) {
        selectedNft = nfts.staked[0]
    } else {
        return false
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


module.exports = {loginSteadyStack}
