const {getWeb3} = require("../services/web3");
const {getPartners} = require("../queries/partners.query");
const {getInjectedUser} = require("../queries/injectedUser.query");
const {getEnv} = require("../services/db");
const {upsertDelegation} = require("../queries/delegate.query");
const delegateAbi = require('../../abi/delegate.abi.json')
const citcapStakingAbi = require('../../abi/citcapStaking.abi.json')
const Sentry = require("@sentry/nextjs");
const {checkElite} = require("../queries/ntElites.query");
const {is3VC} = require("../../src/lib/utils");

const getMoralisImage = (object) => {
    if (object?.media?.mimetype === 'image/gif') {
        return object?.media?.original_media_url
    } else {
        return object?.media?.media_collection?.high?.url ? object.media.media_collection.high.url : object?.media?.original_media_url
    }
}
const getMoralisImageNT = (object) => {
    let image =  object?.media?.media_collection?.high?.url ? object.media.media_collection.high.url : object?.media?.original_media_url
    if(!image) {
        image = object.image
    }
    return image
}

async function isWhale(ownedNfts) {
    if (ownedNfts.length === 0) return false
    const whaleAddress = getEnv().whaleId
    const exists = ownedNfts.find(el => el.token_address.toLowerCase() === whaleAddress.toLowerCase())
    if (!exists) return false;

    return {
        name: exists.name,
        symbol: exists.symbol,
        img: getMoralisImage(exists),
        id: Number(exists.token_id),
        ACL: 0
    }
}


const parseFromUri = async (uri) => {
    const response = await fetch(uri);
    const metadata = await response.json();
    const seasonAttr = metadata.attributes.find(el => el.trait_type === "Season")?.value
    const isS1 = seasonAttr === "Season 1"
    const image = metadata.image
    const id = metadata.name.split("#").at(-1)
    return {
        isS1, image, id
    }
}

const parseFromMetaData = (object) => {
    const metadata = JSON.parse(object.metadata)
    const seasonAttr = metadata.attributes.find(el => el.trait_type === "Season")?.value
    const isS1 = seasonAttr === "Season 1"
    const id = metadata.name.split("#").at(-1)
    const image = false
    return {
        isS1, image, id
    }
}


async function isNeoTokyo(ownedNfts, enabledCollections, address) {
    if (ownedNfts.length === 0) return false

    const S1_config = enabledCollections.find(el => el.address.toLowerCase() === getEnv().ntData.S1.toLowerCase())
    const S2_config = enabledCollections.find(el => el.address.toLowerCase() === getEnv().ntData.S2.toLowerCase())

    const owned_citizens = ownedNfts.filter(el =>
        el.token_address.toLowerCase() === getEnv().ntData.S1.toLowerCase() ||
        el.token_address.toLowerCase() === getEnv().ntData.S2.toLowerCase() ||
        el.token_address.toLowerCase() === getEnv().ntData.staked.toLowerCase()
    )

    let S1 = []
    let S2 = []
    let result
    for(let i=0; i< owned_citizens.length; i++) {
        const uri = owned_citizens[i].token_uri
        const uriTest = uri.split("/").at(-1)
        if(uri === uriTest) {
            if(owned_citizens[i].metadata) {
                result = parseFromMetaData(owned_citizens[i])
            } else {
                Sentry.captureException({location: "isNeoTokyo", type: 'process', citizen: owned_citizens[i]});
                return null
            }
        } else {
            result = await parseFromUri(uri)
        }
        if(result.isS1) {
            S1.push(result)
        } else {
            S2.push(result)
        }
    }


    let multi;
    let nftUsed;
    let ownTranscendence = false

    if(S1.length>0) {
        const S1_ids = S1.map(el => el.id)
        const isElite = await checkElite(S1_ids)

        if (isElite.length > 0) {
            multi = isElite.length * (S1_config.multiplier + Number(getEnv().citCapEliteBoost)) + (S1.length - isElite.length) * S1_config.multiplier + S2.length * S2_config.multiplier
            nftUsed = S1.find(el => el.id == isElite[0].id)
        } else {
            multi = S1.length * S1_config.multiplier + S2.length * S2_config.multiplier
            nftUsed = S1[0]
        }
    } else {
        multi = S2.length * S2_config.multiplier
        nftUsed = S2[0]
    }

    const haveTranscendence = ownedNfts.find(el => el.token_address.toLowerCase() === getEnv().ntData.transcendence.toLowerCase())
    if(haveTranscendence) {
        const transcendence_config = enabledCollections.find(el => el.address.toLowerCase() === getEnv().ntData.transcendence.toLowerCase())
        multi += transcendence_config.multiplier
        ownTranscendence = true
    }

    const {isStaked, stakeSize, stakeDate} = await checkStaking(address)
    return {
        name: nftUsed.isS1 ? "Neo Tokyo Citizen" : "Neo Tokyo Outer Citizen",
        symbol: nftUsed.isS1 ? "NTCTZN" : "NTOCTZN",
        multi: multi,
        img: nftUsed.image,
        id: Number(nftUsed.id),
        ACL: 1,
        transcendence: ownTranscendence,
        stakeReq: nftUsed.isS1 ? Number(getEnv().citcapStakeS1) : Number(getEnv().citcapStakeS2),
        isStaked,
        stakeSize,
        stakeDate
    }
}

async function isPartner(ownedNfts, enabledCollections) {
    if (ownedNfts.length === 0) return false
    const nftUsed = ownedNfts[0]
    const collectionDetails = enabledCollections.find(el => el.address.toLowerCase() === nftUsed.token_address.toLowerCase())
    let multiplier

    if (collectionDetails.isMetadata) {
        const attributeVal = nftUsed.normalized_metadata.attributes.find(el => el.trait_type === collectionDetails.metadataProp)?.value
        multiplier = collectionDetails.metadataVal[attributeVal]
    } else {
        multiplier = collectionDetails.multiplier
    }

    return {
        name: nftUsed.name,
        symbol: nftUsed.symbol,
        multi: multiplier,
        img: getMoralisImage(nftUsed),
        id: nftUsed.token_id ? Number(nftUsed.token_id) : Number(nftUsed.tokenId),
        ACL: 2
    }
}

async function isInjectedUser(address) {
    console.log("AUTH :: Checking if Injected User")
    const user = await getInjectedUser(address)
    if (!user) return false

    return {
        name: user['partner.name'],
        symbol: user['partner.symbol'],
        multi: user['partner.multiplier'],
        img: user['partner.logo'],
        id: 0,
        ACL: 3
    }
}

async function isDelegated(address, enabledCollections) {
    console.log("AUTH :: Checking if Delegated")

    try {
        const {jsonResponse: delegations} = await getWeb3().query.EvmApi.utils.runContractFunction({
            "chain": "0x1",
            "functionName": "getDelegationsByDelegate",
            "address": "0x00000000000076A84feF008CDAbe6409d2FE638B",
            "abi": delegateAbi,
            "params": {delegate: address}
        });

        if (!delegations || delegations?.length === 0) return null

        let tokenId = 0;
        let partnerContract;
        let vault;
        let image;
        let multiplier;

        for (let i = 0; i < enabledCollections.length; i++) {
            const isDelegated = delegations.filter(el => el[3] === enabledCollections[i].address)

            if (isDelegated.length > 0) {

                const parsedDelegation = isDelegated.map(el => ({
                    vault: el[1],
                    address: el[2],
                    partner: el[3],
                    tokenId: Number(el[4])
                }))

                parsedDelegation.forEach(el => {
                    if (el.tokenId > 0) {
                        tokenId = el.tokenId
                        partnerContract = el.partner
                        vault = el.vault
                    }
                })

                if (!partnerContract) {
                    partnerContract = parsedDelegation[0].partner
                    vault = parsedDelegation[0].vault
                }
                break;
            }
        }

        const collectionDetails = enabledCollections.find(el => el.address === partnerContract)
        if (!partnerContract) return false

        image = collectionDetails.logo;
        const {jsonResponse: nftUsed} = await getWeb3().query.EvmApi.nft.getNFTMetadata({
            address: partnerContract,
            chain: "0x1",
            "normalizeMetadata": true,
            tokenId,
        });

        if (nftUsed.normalized_metadata?.image?.startsWith("http")) {
            image = nftUsed.normalized_metadata.image
        }

        await upsertDelegation({address, vault, partner: collectionDetails.address, tokenId})
        if (collectionDetails.isMetadata) {
            const attributeVal = nftUsed.normalized_metadata.attributes.find(el => el.trait_type === collectionDetails.metadataProp)?.value
            multiplier = collectionDetails.metadataVal[attributeVal]
        } else {
            multiplier = collectionDetails.multiplier
        }

        return {
            name: collectionDetails.name,
            symbol: collectionDetails.symbol,
            multi: multiplier,
            img: image,
            id: tokenId,
            ACL: 4,
            vault,
        }
    } catch (e) {

        Sentry.captureException({location: "checkDelegate", error: e, address});
        return false
    }
}

async function feedNfts(address) {
    const enabledCollections = await getPartners(getEnv().isDev, is3VC)
    let userNfts = []
    for (const chain of getWeb3().chains) {
        const searchFor = enabledCollections.filter(el => el.networkChainId === chain._chainlistData.chainId)
        if (searchFor.length > 0) {
            const tokenAddresses = searchFor.map(el => el.address)
            const {jsonResponse} = await getWeb3().query.EvmApi.nft.getWalletNFTs({
                chain,
                address,
                tokenAddresses,
                "format": "decimal",
                "normalizeMetadata": true,
                "disableTotal": true,
                "mediaItems": true,
            });
            userNfts = [...userNfts, ...jsonResponse.result]
        }
    }
    return [userNfts, enabledCollections]
}

async function checkUser(address) {
    console.log("GANG :: checkUser START")

    const [userNfts, enabledCollections] = await feedNfts(address)
    let type

    if (is3VC) {
        type = await isWhale(userNfts)
        if (!type) type = await isPartner(userNfts, enabledCollections)
        if (!type) type = await isInjectedUser(address)
    } else {
        type = await isNeoTokyo(userNfts, enabledCollections, address)
    }
    if (!type) type = await isDelegated(address, enabledCollections)

    return type
}

async function checkStaking (address) {
    const {jsonResponse} = await getWeb3().query.EvmApi.utils.runContractFunction({
        "chain": "0x1",
        "functionName": "getStake",
        "address": getEnv().diamondCitCap,
        "abi": citcapStakingAbi,
        "params": {wallet_: address}
    });

    return {
        isStaked: Number(jsonResponse[0])>0,
        stakeSize: Number(getWeb3().utils.fromWei(jsonResponse[0])),
        stakeDate: Number(jsonResponse[1])
    }
}

module.exports = {checkUser, checkStaking}
