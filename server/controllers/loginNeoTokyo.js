const {getWeb3} = require("../services/web3");
const {getEnv} = require("../services/db");
const citcapCitizenAbi = require('../../abi/citcapCitizen.abi.json')
const citcapStakingAbi = require('../../abi/citcapStaking.abi.json')
const Sentry = require("@sentry/nextjs");
const {checkElite} = require("../queries/ntElites.query");
const {ACLs} = require("../../src/lib/authHelpers");

const getNTimage = (isS1, isStaked, id) => {
    if(isStaked) {
        return isS1 ? `https://neotokyo-v2.sfo3.cdn.digitaloceanspaces.com/stakedCitizen/s1Citizen/pngs/${id}.png` : `https://neotokyo-v2.sfo3.cdn.digitaloceanspaces.com/stakedCitizen/s2Citizen/pngs/${id}.png`
    } else {
       return isS1 ? `https://neotokyo-v2.sfo3.cdn.digitaloceanspaces.com/s1Citizen/pngs/${id}.png` : `https://neotokyo-v2.sfo3.cdn.digitaloceanspaces.com/s2Citizen/pngs/${id}.png`
    }
}


const parseFromUri = async (uri, isStaked) => {
    const response = await fetch(uri);
    const metadata = await response.json();
    const seasonAttr = metadata.attributes.find(el => el.trait_type === "Season")?.value
    const isS1 = seasonAttr === "Season 1"
    const id = metadata.name.split("#").at(-1)
    const image = getNTimage(isS1, isStaked, id)
    return {
        isS1, image, id
    }
}

const parseFromMetaData = (object, isStaked) => {
    const metadata = JSON.parse(object.metadata)
    const seasonAttr = metadata.attributes.find(el => el.trait_type === "Season")?.value
    const isS1 = seasonAttr === "Season 1" || object.token_address.toLowerCase() === getEnv().ntData.S1.toLowerCase()
    // console.log("isS1", isS1)
    const id = metadata.name.split("#").at(-1)
    const image = getNTimage(isS1, isStaked, id)
    return {
        isS1, image, id
    }
}

const getFromBlockchain = async (tokenAddress, tokenID, isStaked) => {
    const {jsonResponse} = await getWeb3().query.EvmApi.utils.runContractFunction({
        "chain": "0x1",
        "functionName": "tokenURI",
        "address": tokenAddress,
        "abi": citcapCitizenAbi,
        "params": {tokenId: tokenID}
    });
    const base64Url = jsonResponse.replace(/^data:application\/json;base64,/, '');
    const decodedData = atob(base64Url).replace(': ""',':"');
    let metadata = JSON.parse(decodedData.replace( /(\"description\":\s?\")(.+)?(\",)/g, ''));

    const seasonAttr = metadata.attributes.find(el => el.trait_type === "Season")?.value
    const isS1 = seasonAttr === "Season 1"
    const id = metadata.name.split("#").at(-1)
    const image = getNTimage(isS1, isStaked, id)
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

    // console.log("owned_citizens",owned_citizens)

    let S1 = []
    let S2 = []
    let result
    for (let i = 0; i < owned_citizens.length; i++) {
        const isStaked = owned_citizens[i].token_address.toLowerCase() === getEnv().ntData.staked.toLowerCase()
        const uri = owned_citizens[i].token_uri
        const uriTest = uri ? uri.split("/").at(-1) : null
        if (!uriTest || uri === uriTest) {
            if (owned_citizens[i].metadata) {
                // console.log("1", owned_citizens[i].token_id)
                result = parseFromMetaData(owned_citizens[i], isStaked)
            } else {
                // console.log("2", owned_citizens[i].token_id)
                result = await getFromBlockchain(owned_citizens[i].token_address, owned_citizens[i].token_id, isStaked)
            }
        } else {
            // console.log("3", owned_citizens[i].token_id)
            result = await parseFromUri(uri, isStaked)
        }

        if(!result) {
            Sentry.captureException({location: "isNeoTokyo", type: 'process', citizen: owned_citizens[i]});
            return null
        } else {
            result.isStaked = isStaked
        }
        if (result?.isS1) {
            S1.push(result)
        } else {
            S2.push(result)
        }
    }

    // console.log("S1", S1)

    let multi;
    let nftUsed;
    let ownTranscendence = false

    if (S1.length > 0) {
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
    // console.log("nftUsed", nftUsed)

    const haveTranscendence = ownedNfts.find(el => el.token_address.toLowerCase() === getEnv().ntData.transcendence.toLowerCase())
    if (haveTranscendence) {
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
        ACL: ACLs.Admin,
        // ACL: ACLs.NeoTokyo,
        transcendence: ownTranscendence,
        stakeReq: nftUsed.isStaked ? Number(getEnv().citcapStakeS2) : (nftUsed.isS1 ? Number(getEnv().citcapStakeS1) : Number(getEnv().citcapStakeS2)),
        isStaked,
        stakeSize,
        stakeDate
    }
}

async function checkStaking(address) {
    const {jsonResponse} = await getWeb3().query.EvmApi.utils.runContractFunction({
        "chain": "0x1",
        "functionName": "getStake",
        "address": getEnv().diamondCitCap,
        "abi": citcapStakingAbi,
        "params": {wallet_: address}
    });

    return {
        isStaked: Number(jsonResponse[0]) > 0,
        stakeSize: Number(getWeb3().utils.fromWei(jsonResponse[0])),
        stakeDate: Number(jsonResponse[1])
    }
}

module.exports = {isNeoTokyo, checkStaking}
