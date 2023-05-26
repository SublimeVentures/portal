const {getWeb3} = require("../services/web3");
const {getPartners} = require("../queries/partners.query");
const {getInjectedUser} = require("../queries/injectedUser.query");
const {getEnv} = require("../services/db/utils");
const {upsertDelegation} = require("../queries/delegate.query");
const delegateAbi = require('./delegate.abi.json')

async function isWhale(ownedNfts) {
    const whaleAddress = getEnv().whaleId
    const exists = ownedNfts.find(el => el.token_address.toLowerCase() === whaleAddress.toLowerCase())
    if (!exists) return false;

    return {
        amt: 1,
        name: exists.name,
        symbol: exists.symbol,
        type: exists.contract_type,
        img: exists?.media?.media_collection?.high?.url,
        id: Number(exists.token_id),
        ACL: 0
    }
}

async function isPartner(ownedNfts) {
    console.log("AUTH :: Checking if Partner")
    if (ownedNfts.length === 0) return false
    console.log("ownedNfts",ownedNfts) //todo: remove

    return {
        amt: ownedNfts.length,
        name: ownedNfts[0].name,
        symbol: ownedNfts[0].symbol,
        type: ownedNfts[0].contract_type,
        img: ownedNfts[0]?.media?.media_collection?.high?.url ? ownedNfts[0].media.media_collection.high.url : ownedNfts[0]?.media?.original_media_url,
        id: ownedNfts[0].tokenId ? Number(ownedNfts[0].tokenId) : Number(ownedNfts[0].token_id),
        ACL: 1
    }
}

async function isInjectedUser(address) {
    console.log("AUTH :: Checking if Injected User")
    const user = await getInjectedUser(address)
    if (!user) return false

    return {
        amt: user.multi,
        name: user['partner.name'],
        symbol: user['partner.symbol'],
        type: `ERC${user['partner.erc']}`,
        img: user['partner.logo'],
        id: 0,
        ACL: 2
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

        if (delegations?.length > 0) {
            let amt = 0;
            let tokenId = 0;
            let partnerContract;
            let vault;
            for (let i = 0; i < enabledCollections.length; i++) {
                const isDelegated = delegations.filter(el => el[3] === enabledCollections[i].address)
                if (isDelegated.length > 0) {
                    const parsedDelegation = isDelegated.map(el=>({
                        vault: el[1],
                        address: el[2],
                        partner: el[3],
                        tokenId: Number(el[4])
                    }))
                    amt += parsedDelegation.length
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
                }
            }
            console.log("vault", vault)

            if (amt > 0) {
                const partner = enabledCollections.find(el => el.address === partnerContract)
                let image = partner.logo;

                if (tokenId !== 0) {
                    const {jsonResponse: metadata} = await getWeb3().query.EvmApi.nft.getNFTMetadata({
                        partnerContract,
                        chain: "0x1",
                        tokenId,
                    });
                    image = metadata?.media?.media_collection?.high?.url
                }

                await upsertDelegation({address, vault, partner: partner.address, tokenId})

                return {
                    amt: amt,
                    name: partner.name,
                    symbol: partner.symbol,
                    type: `ERC${partner.type}`,
                    img: image,
                    id: tokenId,
                    ACL: 3
                }
            } else return false

        } else {
            return false;
        }
    } catch (e) {
        console.log("e, checkDelegate ::", e)
        return false
    }
}

async function feedNfts(address) {
    const enabledCollections = await getPartners(getEnv().isDev)
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
                "disableTotal": true,
                "mediaItems": true,
            });
            userNfts = [...userNfts, ...jsonResponse.result]
        }

    }
    return [userNfts, enabledCollections]
}

async function login(address) {
    const [userNfts, enabledCollections] = await feedNfts(address)
    let type = await isWhale(userNfts)
    if (!type) type = await isPartner(userNfts)
    if (!type) type = await isInjectedUser(address)
    if (!type) type = await isDelegated(address, enabledCollections)
    return type
}


module.exports = {login, feedNfts}
