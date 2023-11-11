const {getInjectedUser} = require("../../queries/injectedUser.query");
const {getEnv} = require("../../services/db");
const {ACLs} = require("../../../src/lib/authHelpers");
const {isDelegated} = require("./delegated");
const {isPartnerSpecial} = require("./partners");
const {getPartnerAvatar, filterNFTsByPartnersAndLevel, selectHighestMultiplier} = require("./helper");


async function isPartner(nfts, partners) {
    const regularPartners = partners.filter(el => el.level === 10)
    if (regularPartners.length === 0) return false

    const ownedNfts_basePartners = filterNFTsByPartnersAndLevel(nfts, regularPartners, 10)
    const { nftWithHighestMultiplier, highestMultiplier, collectionSetup } = selectHighestMultiplier(ownedNfts_basePartners, regularPartners)

    const tokenId = nftWithHighestMultiplier.token_id ? Number(nftWithHighestMultiplier.token_id) : Number(nftWithHighestMultiplier.tokenId)
    const image = await getPartnerAvatar(tokenId, collectionSetup)
    return {
        symbol: collectionSetup.symbol,
        multi: highestMultiplier,
        img: image,
        img_fallback: collectionSetup.logo,
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
    if (ownedNfts.length === 0) return false
    const ownedWhale = ownedNfts.find(el => el.token_address.toLowerCase() === getEnv().whaleId.toLowerCase())
    if (!ownedWhale) return false;

    return {
        symbol: ownedWhale.symbol,
        img: "",//todo:
        id: Number(ownedWhale.token_id),
        ACL: ACLs.Whale
    }
}

async function loginBased(nfts, partners, address) {
    let type = await isWhale(nfts)
    if (!type) type = await isPartner(nfts, partners)
    if (!type) type = await isInjectedUser(address)
    if (!type) type = await isPartnerSpecial(nfts, partners, address)
    if (!type) type = await isDelegated(address, partners)

    return type
}


module.exports = {loginBased}
