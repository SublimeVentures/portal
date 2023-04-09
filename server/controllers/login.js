const {getEnv} = require("../services/mongo");
const {getWeb3} = require("../services/web3");
const {getPartners, getPartner} = require("../queries/partner");
const {getInjectedUser} = require("../queries/injectedUser");


async function isWhale(vault) {
    console.log("AUTH :: Checking if Whale")
    const whaleAddress = getEnv().whale
    const result = vault.find(el => el.contract.address === whaleAddress)
    if (!result) return false;

    return {
        amt: 1,
        name: result.contract.name,
        symbol: result.contract.symbol,
        type: result.contract.tokenType,
        img: result.contract.openSea.imageUrl,
        id: result.tokenId,
        ACL: 0
    }
}

async function isPartner(vault) {
    console.log("AUTH :: Checking if Partner")
    const partners = await getPartners()
    let linkedPartner = [];
    for (let i = 0; i < partners.length; i++) {
        const result = vault.filter(el => el.contract.address === partners[i].address)
        if (result.length > 0) linkedPartner = [...linkedPartner, ...result]
    }
    if (linkedPartner.length === 0) return false

    return {
        amt: linkedPartner.length,
        name: linkedPartner[0].contract.name,
        symbol: linkedPartner[0].contract.symbol,
        type: linkedPartner[0].contract.tokenType,
        img: linkedPartner[0].contract.openSea.imageUrl,
        id: linkedPartner[0].tokenId,
        ACL: 1
    }
}

async function isInjectedUser(address) {
    console.log("AUTH :: Checking if Injected User")
    const user = await getInjectedUser(address)
    if (!user) return false
    const partnerData = await getPartner(user.partner)

    return {
        amt: user.multi,
        name: partnerData.name,
        symbol: partnerData.symbol,
        type: `ERC${partnerData.type}`,
        img: partnerData.logo,
        id: null,
        ACL: 2
    }
}

//todo: sprawdź delegated
//todo: switch to SEPOLIA & TEST IT!!!
async function login(address) {
    //@dev: maybe add pageKey support?
    const {ownedNfts} = await getWeb3().eth.nft.getNftsForOwner(address)
    let type = await isWhale(ownedNfts)
    if (!type) type = await isPartner(ownedNfts)
    if (!type) type = await isInjectedUser(address)
    return type
}

module.exports = {login}
