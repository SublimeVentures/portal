const {getInjectedUser} = require("../../queries/injectedUser.query");
const {getEnv} = require("../../services/db");
const {ACLs} = require("../../../src/lib/authHelpers");
const {isDelegated} = require("./delegated");
const {isSteadyStack} = require("./steadystack");

const buildUrl = (path) => {
    if(path.startsWith("http")) { //centralized hosting
        return path
    } else { //ipfs hosting
        return getEnv().piniataGateway + path
    }
}


const getPartnerAvatar = async (tokenId, collectionDetails) => {
    let URL
    if(collectionDetails?.imageUri) { //avatar uri available in DB
        URL = buildUrl(collectionDetails.imageUri)

        if(collectionDetails.isDynamicImage) { //fetch with id
            URL = URL.replace("[ID]", tokenId)
        }

    } else { //feed avatar from metadata
        let metadata_url = buildUrl(collectionDetails.tokenUri)
        if(collectionDetails.isDynamicImage) { //fetch with id
            metadata_url = metadata_url.replace("[ID]", tokenId)
        }
        metadata_url += `?pinataGatewayToken=${getEnv().piniataKey}`

        const metadata_req = await fetch(metadata_url);
        const matadata = await metadata_req.json();
        if(matadata.image.startsWith("http")) { //centralized hosting
            URL = matadata.image
        } else { //ipfs hosting
            const uriSplit = matadata.image.split("ipfs://")
            URL = getEnv().piniataGateway + "ipfs/" + uriSplit[1]
        }
        URL = matadata.image
    }

   return URL

}

async function isWhale(ownedNfts) {
    if (ownedNfts.length === 0) return false
    const whaleAddress = getEnv().whaleId
    const exists = ownedNfts.find(el => el.token_address.toLowerCase() === whaleAddress.toLowerCase())
    if (!exists) return false;

    return {
        symbol: exists.symbol,
        img: "",//todo:
        id: Number(exists.token_id),
        ACL: ACLs.Whale
    }
}

async function isPartner(ownedNfts, enabledCollections) {
    if (ownedNfts.length === 0) return false

    let nftUsed;
    let collectionDetails;
    for(let i=0; i<enabledCollections.length-1; i++) {
        nftUsed = ownedNfts.find(el => el.token_address.toLowerCase() === enabledCollections[i].address.toLowerCase())
        if(nftUsed) {
            collectionDetails = enabledCollections[i]
            break;
        }
    }
    // const nftUsed = ownedNfts[0]
    // const collectionDetails = enabledCollections.find(el => el.address.toLowerCase() === nftUsed.token_address.toLowerCase())



    let multiplier

    if (collectionDetails.isMetadata) {
        const attributeVal = nftUsed.normalized_metadata.attributes.find(el => el.trait_type === collectionDetails.metadataProp)?.value
        multiplier = collectionDetails.metadataVal[attributeVal]
    } else {
        multiplier = collectionDetails.multiplier
    }

    const tokenId = nftUsed.token_id ? Number(nftUsed.token_id) : Number(nftUsed.tokenId)
    const image = await getPartnerAvatar(tokenId, collectionDetails)
    return {
        symbol: nftUsed.symbol,
        multi: multiplier,
        img: image,
        img_fallback: collectionDetails.logo,
        id: tokenId,
        ACL: ACLs.Partner

    }
}

async function isInjectedUser(address) {
    // console.log("AUTH :: Checking if Injected User")
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



async function loginBased(userNfts, enabledCollections, address) {
    let type = await isWhale(userNfts)
    if (!type) type = await isPartner(userNfts, enabledCollections)
    if (!type) type = await isInjectedUser(address)
    if (!type) type = await isDelegated(address, enabledCollections)
    if (!type) type = await isSteadyStack(address, enabledCollections)
    return type
}


module.exports = {loginBased}
