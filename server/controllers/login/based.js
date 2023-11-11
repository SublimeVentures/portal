const {getInjectedUser} = require("../../queries/injectedUser.query");
const {getEnv} = require("../../services/db");
const {ACLs} = require("../../../src/lib/authHelpers");
const {isDelegated} = require("./delegated");
const {isPartnerSpecial} = require("./partners");

const buildUrl = (path) => {
    if(path.startsWith("http")) { //centralized hosting
        return path
    } else { //ipfs hosting
        return getEnv().piniataGateway + path
    }
}

const getPartnerAvatar = async (tokenId, collectionDetails) => {
    if (collectionDetails?.imageUri) {
        return buildUrl(collectionDetails.imageUri).replace("[ID]", collectionDetails.isDynamicImage ? tokenId : '');
    }

    const metadataUrl = `${buildUrl(collectionDetails.tokenUri).replace("[ID]", collectionDetails.isDynamicImage ? tokenId : '')}?pinataGatewayToken=${getEnv().piniataKey}`;
    const metadataResponse = await fetch(metadataUrl);
    const metadata = await metadataResponse.json();

    return metadata.image.startsWith("http") ? metadata.image : `${getEnv().piniataGateway}ipfs/${metadata.image.split("ipfs://")[1]}`;
};

function selectHighestMultiplier(ownedNfts, enabledCollections) {
    let nftWithHighestMultiplier = null;
    let highestMultiplier = 0;
    let collectionSetup = null;

    for (const nft of ownedNfts) {
        const collectionDetails = enabledCollections.find(el => el.address.toLowerCase() === nft.token_address.toLowerCase());

        if (!collectionDetails) continue; // Skip if the collection is not enabled

        let multiplier;

        if (collectionDetails.isMetadata) {
            const attributeVal = nft.normalized_metadata.attributes.find(el => el.trait_type === collectionDetails.metadataProp)?.value;
            multiplier = collectionDetails.metadataVal[attributeVal] || 0;
        } else {
            multiplier = collectionDetails.multiplier || 0;
        }

        if (multiplier > highestMultiplier) {
            highestMultiplier = multiplier;
            nftWithHighestMultiplier = nft;
            collectionSetup = collectionDetails
        }
    }

    return {
        nftWithHighestMultiplier,
        highestMultiplier,
        collectionSetup
    }
}

function filterNFTsByPartnersAndLevel(nfts, allPartners, requiredPartnerLevel) {
    // Filter the nfts array
    return nfts.filter((nft) => {
        // Find a matching partner with the same address (case insensitive) and level 10
        const matchingPartner = allPartners.find((partner) => {
            return partner.address.toLowerCase() === nft.token_address.toLowerCase() && partner.level === requiredPartnerLevel;
        });
        // Return true to keep this NFT if there is a matching partner
        return matchingPartner !== undefined;
    });
}

async function isPartner(nfts, partners) {
    const regularPartners = partners.filter(el => el.level === 10 && el.erc === '721')
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
