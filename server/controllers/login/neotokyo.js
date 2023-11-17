const {getWeb3} = require("../../services/web3");
const {getEnv} = require("../../services/db");
const {checkElite, checkBytesTimelock, checkBytesStake} = require("../../queries/neoTokyo.query");
const {ACLs, userIdentification} = require("../../../src/lib/authHelpers");
const {getRefreshToken, deleteRefreshToken, refreshAuth} = require("./tokens");


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

async function updateStakingNT(S1, S2) {
    let NFTs = [...S1, ...S2]
    // Map NFTs to include season
    const mappedNFTs = NFTs.map(nft => ({
        tokenId: nft.tokenId,
        season: nft.isS1 ? 1 : 2
    }));

    const stakeData = await checkBytesStake(mappedNFTs);
    console.log("stake", stakeData);

    NFTs = NFTs.map(nft => {
        const stakeInfo = stakeData.find(stake => stake.tokenId === nft.tokenId && stake.season === (nft.isS1 ? 1 : 2));
        return {
            ...nft,
            bytesStakedNT: stakeInfo ? stakeInfo.bytes : 0,
            bytesStakedNT_timelock: stakeInfo ? stakeInfo.timelock : 0
        };
    });

    return NFTs
}


function selectPointMultiplier(days) {
    let multiplier = 1.00;
    const stakingTimelock = getEnv().stakingTimelock;

    for (const key in stakingTimelock) {
        if (Number(key) <= days) {
            multiplier = stakingTimelock[key];
        }
    }

    return multiplier;
}


// async function checkStakingNT(address) { //todo:
//     const stakingDetails = await getWeb3().contracts.ntStake.methods.getStakerPositions(address).call();
//     const S1 = {}
//     const S2 = {}
//     stakingDetails.stakedS1Citizens.forEach(item=> {
//         const { citizenId, ...data } = item;
//         S1[citizenId] = {
//             stakedBytes: Math.floor(Number(getWeb3().utils.fromWei(`${data.stakedBytes}`))),
//             timelockEndTime: Number(data.timelockEndTime),
//             points: Number(data.points),
//             stakedVaultId: Number(data.stakedVaultId),
//             hasVault: data.hasVault
//         };
//
//     })
//     stakingDetails.stakedS2Citizens.forEach(item=> {
//         const { citizenId, ...data } = item;
//         S2[citizenId] = {
//             stakedBytes: Math.floor(Number(getWeb3().utils.fromWei(`${data.stakedBytes}`))),
//             timelockEndTime: Number(data.timelockEndTime),
//             points: Number(data.points),
//         };
//
//     })
//     return {
//         stakedLP: {
//             amount: Number(stakingDetails.stakedLPPosition.amount),
//             timelockEndTime: Number(stakingDetails.stakedLPPosition.timelockEndTime),
//             points: Number(stakingDetails.stakedLPPosition.points),
//             multiplier: Number(stakingDetails.stakedLPPosition.multiplier)
//         },
//         stakedS2: S2,
//         stakedS1: S1
//     }
// }

async function checkBytesOwned(address) {
    const bytesOwned_raw = await getWeb3().contracts.bytes.methods.balanceOf(address).call();
    return Math.floor(Number(getWeb3().utils.fromWei(`${bytesOwned_raw}`)))
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

function calcAllocationBase(NFTs) {
    let allocationBase = 0

    NFTs.forEach(identity => {
        if(identity.isS1) {
            allocationBase += identity.isElite ? getEnv().allocationBase.elite * 1000 : getEnv().allocationBase.s1 * 1000
        } else {
            allocationBase += getEnv().allocationBase.s2 * 1000
        }
    })

    return allocationBase / 1000
}

function calcAllocationExtra(stakeCitCap, bytesOnWallet, NFTs) {
    let totalBonusPoints = 0

    NFTs.forEach(identity => {
        totalBonusPoints += ((identity.bytesStakedNT * selectPointMultiplier(identity.bytesStakedNT_timelock)) + stakeCitCap + (bytesOnWallet * 0.25)) * identity.rewardRate
    })

    return Math.floor(totalBonusPoints)


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


async function loginNeoTokyo(nfts, partners, address) {
    try {
        const [S1_staked, S2_staked] = await isStaked(nfts)
        const S1 = await isS1(nfts)
        const S2 = await isS2(nfts)

        let S1_all = [...S1_staked, ...S1]
        let S2_all = [...S2_staked, ...S2]

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

        //STAKING DATA ENRICH
        const NFTs = await updateStakingNT(S1_all, S2_all)

        //Fetch stake: CitCap
        const {isStaked: didUserStake, stakeSize, stakeDate} = await checkStakingCitCap(address)
        //Fetch BYTES
        const extra_bytes_owned = await checkBytesOwned(address)

        const allocation_base = calcAllocationBase(NFTs)
        const allocation_bonus = calcAllocationExtra(
            stakeSize,
            extra_bytes_owned,
            NFTs
        )

        const nftDisplay = haveElites.length>0 ? S1_all.find(el=>el.isElite) : (S1_all.length>0 ? NFTs.find(el=>el.isS1) : NFTs.find(el=>!el.isS1))

        return {
            symbol: nftDisplay.isS1 ? "NTCTZN" : "NTOCTZN",
            multi: allocation_base,
            allocationBonus: allocation_bonus,
            img: nftDisplay.image,
            img_fallback: nftDisplay.image,
            id: nftDisplay.tokenId,
            ACL: ACLs.NeoTokyo,
            //CitCap specific params
            isElite: haveElites.length>0,
            isS1: nftDisplay.isS1,
            stakeReq: Number(getEnv().stakeCitCapAmount),
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
