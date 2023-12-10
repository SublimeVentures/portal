const {getEnv} = require("../../services/db");

const buildUrl = (path) => {
    if (path.startsWith("http")) { //centralized hosting
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

function selectHighestMultiplier(ownedNfts) {
    let nftWithHighestMultiplier = null;
    let highestMultiplier = 0;

    for (const nft of ownedNfts) {

        let multiplier;

        if (nft.partnerDetails.isMetadata && nft.normalized_metadata.name) {
            const attributeVal = nft.normalized_metadata.attributes.find(el => el.trait_type === nft.partnerDetails.metadataProp)?.value;
            multiplier = nft.partnerDetails.metadataVal[attributeVal] || 0;
        } else {
            multiplier = nft.partnerDetails.multiplier || 0;
        }

        if (multiplier > highestMultiplier) {
            highestMultiplier = multiplier;
            nftWithHighestMultiplier = nft;
        }
    }

    return {
        nftWithHighestMultiplier,
        highestMultiplier,
    }
}


module.exports = {getPartnerAvatar, selectHighestMultiplier}
