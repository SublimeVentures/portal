const {getWeb3} = require("../../services/web3");
const {getEnv} = require("../../services/db");
const {checkElite} = require("../../queries/ntElites.query");
const {ACLs, userIdentification} = require("../../../src/lib/authHelpers");
const {getRefreshToken, deleteRefreshToken, refreshAuth} = require("./tokens");

// todo: data
// https://docs.google.com/spreadsheets/d/1VaX7jUfFNTP-JlB4nBXjCcAPLMiqtcfnjP66Ta8AKK4/edit#gid=1254059059
// https://docs.google.com/document/d/1ONP_IAGfCYSE17wk5fQvWlZK_Mq7WiM0NxAqly6ZcUM/edit

const rewardRateMapping = { //extract to db table
    1: 1,
    2: 1.1,
    3: 1.2,
    4: 1.3,
    5: 1.4,
    6: 1.5,
    7: 1.6,
    8: 1.7,
    9: 1.8,
    10: 1.9,
    11: 2,
    12: 2.1,
    13: 2.2,
    14: 2.3,
    15: 2.5
};

async function processS1(tokenIds, isStaked = false) {

    const urls = tokenIds.map(tokenId =>
        isStaked ? `https://neo-tokyo.nyc3.cdn.digitaloceanspaces.com/stakedCitizen/s1Citizen/metadata/${tokenId}` : `https://neo-tokyo.nyc3.cdn.digitaloceanspaces.com/s1Citizen/metadata/${tokenId}.json`
    );
    try {
        const requests = urls.map(url => fetch(url));
        const responses = await Promise.all(requests);
        const data = await Promise.all(responses.map(res => res.json()));

        return data.map(item => {
            const rewardRateTrait = item.attributes.find(attr => attr.trait_type === 'Reward Rate');
            const rewardRateTraitValue = rewardRateTrait ? Number(rewardRateTrait.value) : 1;
            const pointMultiplier = getEnv().rewardRate[rewardRateTraitValue] || 1;

            const tokenIdMatch = item.name.match(/\d+/);
            const tokenId = tokenIdMatch ? Number(tokenIdMatch[0]) : 999999;

            return {
                tokenId: tokenId,
                image: item.image,
                rewardRate: pointMultiplier,
                isS1: true,
                isStaked
            };
        });
    } catch (error) {
        console.error('Error fetching token data:', error);
        return [];
    }
}

async function isS1(nfts){
    const ownedS1 = nfts.filter(el => el.token_address.toLowerCase() === getEnv().ntData.S1.toLowerCase())
    if(ownedS1.length === 0) return [];
    const tokenIds = ownedS1.map(nft => nft.token_id);
    return await processS1(tokenIds)
}

async function processS2(tokenIds, isStaked = false) {
    const urls = tokenIds.map(tokenId => isStaked ? `https://neo-tokyo.nyc3.cdn.digitaloceanspaces.com/stakedCitizen/s2Citizen/metadata/${tokenId}` : `https://neo-tokyo.nyc3.cdn.digitaloceanspaces.com/s2Citizen/metadata/${tokenId}.json`)
    try {
        const requests = urls.map(url => fetch(url));
        const responses = await Promise.all(requests);
        const data = await Promise.all(responses.map(res => res.json()));

        return data.map(item => {
            const allocationTrait = item.attributes.find(attr => attr.trait_type === 'Allocation');
            const allocationTraitValue = allocationTrait ? allocationTrait.value : "Low";
            const pointMultiplier = getEnv().allocationTrait[allocationTraitValue] || 1;

            const tokenIdMatch = item.name.match(/\d+/);
            const tokenId = tokenIdMatch ? Number(tokenIdMatch[0]) : 888888;

            return {
                tokenId: tokenId,
                image: item.image,
                rewardRate: pointMultiplier,
                isS1: false,
                isStaked
            };
        });
    } catch (error) {
        console.error(`Error fetching token data S2, isStaked ${isStaked}`, error);

        return [];
    }
}

async function isS2(nfts){
    const ownedS2 = nfts.filter(el => el.token_address.toLowerCase() === getEnv().ntData.S2.toLowerCase())
    if(ownedS2.length === 0) return [];
    const tokenIds = ownedS2.map(nft => nft.token_id);
    return await processS2(tokenIds)
}

function decodeTokenID(id) {
    const bigId = BigInt(id);
    const address = bigId >> BigInt(96);
    const tokenId = bigId & BigInt("0xFFFFFFFFFFFFFFFF"); // Mask to get the last 64 bits
    return {
        address: address.toString(16), // Convert to hexadecimal
        tokenId: tokenId.toString() // Convert to string to avoid precision issues with large numbers
    };
}

async function isStaked(nfts){
    const ownedStaked = nfts.filter(el => el.token_address.toLowerCase() === getEnv().ntData.staked.toLowerCase())
    if(ownedStaked.length === 0) return [[], []];

    const stakedCitizens = ownedStaked.map(stakedNFT => {
        const decoded = decodeTokenID(stakedNFT.token_id)
        return {
            tokenId: decoded.tokenId,
            isS1: `0x${decoded.address}` == getEnv().ntData.S1.toLowerCase()
        }
    });

    const s1TokenIds = stakedCitizens.filter(item => item.isS1).map(item => item.tokenId);
    const s2TokenIds = stakedCitizens.filter(item => !item.isS1).map(item => item.tokenId);

    const S1_staked = s1TokenIds.length > 0 ? await processS1(s1TokenIds, true) : [];
    const S2_staked = s2TokenIds.length > 0 ? await processS2(s2TokenIds, true) : [];

    return [S1_staked, S2_staked];
}

async function checkStakingCitCap(address) {
    const stakingDetails = await getWeb3().contracts.citcap.methods.getStake(address).call();
    return {
        isStaked: Number(stakingDetails.size) > 0,
        stakeSize: Number(getWeb3().utils.fromWei(`${stakingDetails.size}`)),
        stakeDate: Number(stakingDetails.stakedAt)
    }
}

async function checkStakingNT(address) {
    const stakingDetails = await getWeb3().contracts.citcap.methods.getStake(address).call();
    return {
        isStaked: Number(stakingDetails.size) > 0,
        stakeSize: Number(getWeb3().utils.fromWei(`${stakingDetails.size}`)),
        stakeDate: Number(stakingDetails.stakedAt)
    }
}

async function checkBytesOwned(address) {
    const bytesOwned_raw = await getWeb3().contracts.bytes.methods.balanceOf(address).call();
    return Math.floor(Number(getWeb3().utils.fromWei(`${bytesOwned_raw}`)))
}

const updateSessionStaking = async (user) => {
    try {
        const session = getRefreshToken(user)
        deleteRefreshToken(user)
        if (user !== session.userData[userIdentification]) {
            throw new Error("data not match")
        }
        const {isStaked, stakeSize, stakeDate} = await checkStakingCitCap(user)
        return await refreshAuth(session.userData, {isStaked, stakeSize, stakeDate})
    } catch (e) {
        return null
    }
}

function updateEliteStatus(S1_all, haveElites) {
    return S1_all.map(element => {
        // Check if element's tokenId is in the isElite array
        const isEliteFound = haveElites.find(elite => parseInt(elite.id) === parseInt(element.tokenId));

        // If found, update isElite property to true
        if (isEliteFound) {
            return { ...element, isElite: true };
        }
        return element;
    });
}


async function loginNeoTokyo(nfts, partners, address) {
    try {
        const [S1_staked, S2_staked] = await isStaked(nfts)
        const S1 = await isS1(nfts)
        const S2 = await isS2(nfts)

        let S1_all = [...S1_staked, ...S1]
        const S2_all = [...S2_staked, ...S2]

        if(S1_all.length === 0 && S2_all.length ===0) return false;

        //ELITES DATA ENRICH
        let haveElites = []
        if(S1_all.length > 0) {
            const S1_ids = S1_all.map(nft => nft.tokenId);
            haveElites = await checkElite(S1_ids)
            if(haveElites.length>0) {
                S1_all = updateEliteStatus(S1_all, haveElites);
            }
        }


        //FETCH BYTES OWNED

        console.log("S1",S1_all)
        console.log("S2",S2_all)

        const extra_bytes = await checkBytesOwned(address)
        console.log("extra_bytes",extra_bytes)

        let base_allocation = 0


        //CALCUALTE MULTIPLIER
        //todo: fetch bytes staked with nt
        //todo: do staking lock
        //todo: sort for strongest
        // let multiplier = 0
        // let ownTranscendence = false
        // let nftUsed = S1_all.length > 0 ? S1_all[0] : S2_all[0]
        //
        //
        // //-nft owned
        // const S1_setup = partners.find(el => el?.address?.toLowerCase() === getEnv().ntData.S1.toLowerCase())
        // const S2_setup = partners.find(el => el.address.toLowerCase() === getEnv().ntData.S2.toLowerCase())
        // multiplier += haveElites.length * (S1_setup.multiplier + Number(getEnv().citCapEliteBoost)) //add elite multi
        // multiplier += (S1_all.length - haveElites.length) * S1_setup.multiplier //add S1 non elite multi
        // multiplier += S2.length * S2_setup.multiplier //add S2 multi
        //

        //CHECK STAKE
        const {isStaked: didUserStake, stakeSize, stakeDate} = await checkStakingCitCap(address)

        return {
            symbol: nftUsed.isS1 ? "NTCTZN" : "NTOCTZN",
            multi: multiplier,
            img: nftUsed.image,
            img_fallback: nftUsed.image, //todo: fallback to logo if img not found
            id: Number(nftUsed.tokenId),
            ACL: ACLs.NeoTokyo,
            // ACL: ACLs.Admin,
            //CitCap specific params
            isElite: haveElites.length>0,
            isS1: nftUsed.isS1,
            stakeReq: Number(getEnv().stake),
            isStaked: didUserStake,
            stakeSize,
            stakeDate
        }
    } catch(error) {
        console.log("NeoTokyo login error", error)
        return false
    }

}



module.exports = {loginNeoTokyo, updateSessionStaking}
