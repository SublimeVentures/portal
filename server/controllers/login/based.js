const {getInjectedUser} = require("../../queries/injectedUser.query");
const {getEnv} = require("../../services/db");
const {ACLs} = require("../../../src/lib/authHelpers");
const {isDelegated} = require("./delegated");
const {isPartnerSpecial} = require("./partners");
const {getPartnerAvatar, selectHighestMultiplier} = require("./helper");


async function isPartner(allNFTs) {
    const regularPartners = allNFTs.filter(el => el.partnerDetails.level === 10)
    if(regularPartners.length === 0) return

    const { nftWithHighestMultiplier, highestMultiplier } = selectHighestMultiplier(regularPartners)
    const tokenId = nftWithHighestMultiplier?.token_id ? Number(nftWithHighestMultiplier.token_id) : Number(nftWithHighestMultiplier.tokenId)
    const image = await getPartnerAvatar(tokenId, nftWithHighestMultiplier.partnerDetails)
    return {
        symbol: nftWithHighestMultiplier.partnerDetails.symbol,
        multi: highestMultiplier,
        img: image,
        img_fallback: nftWithHighestMultiplier.partnerDetails.logo,
        id: tokenId,
        ACL: ACLs.Partner
    }
}

async function isInjectedUser(address) {
    const user = await getInjectedUser(address)
    if (!user) return false

    return {
        symbol: user['partner.symbol'],
        multi: user['partner.multiplier'],
        img: user['partner.logo'],
        id: 0,
        ACL: ACLs.PartnerInjected
    }
}


async function isWhale(ownedNfts) {
    const ownedWhale = ownedNfts.find(el => el.token_address.toLowerCase() === getEnv().whaleId.toLowerCase())
    if (!ownedWhale) return false;

    return {
        symbol: ownedWhale.symbol,
        img: "",//todo:
        id: Number(ownedWhale.token_id),
        ACL: ACLs.Whale
    }
}

function assignLevel(nfts, partners) {
    const partnerMap = new Map(partners.map(partner => [partner.address.toLowerCase(), partner]));

    nfts.forEach(nft => {
        nft.partnerDetails = partnerMap.get(nft.token_address.toLowerCase());
    });

    return nfts;
}

async function loginBased(nfts, partners, address) {
    const nftsEnriched = assignLevel(nfts, partners)
    let type = await isWhale(nftsEnriched)
    if (!type) type = await isPartner(nfts, partners)
    // if (!type) type = await isInjectedUser(address)
    if (!type) type = await isPartnerSpecial(nfts, partners, address)
    // if (!type) type = await isDelegated(address, partners)

    return type
}


module.exports = {loginBased}
