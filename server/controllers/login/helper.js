const {getEnv} = require("../../services/db");

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

module.exports = {getPartnerAvatar, selectHighestMultiplier, filterNFTsByPartnersAndLevel}
