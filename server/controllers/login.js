const {getEnv} = require("../services/mongo");
const {getWeb3} = require("../services/web3");
const {getPartners, getPartner} = require("../queries/partner");
const {getInjectedUser} = require("../queries/injectedUser");


async function isWhale(vault) {
    console.log("AUTH :: Checking if Whale")
    const whaleAddress = getEnv().whale
    const result = vault.filter(el => el.contract.address === whaleAddress)
    return result.length>0 ? {nfts: result, ACL:0} : false
}

async function isPartner(vault) {
    console.log("AUTH :: Checking if Partner")
    const partners = await getPartners()
    let linkedPartner = [];
    for(let i=0; i<partners.length; i++) {
        const result = vault.filter(el => el.contract.address === partners[i].address)
        if(result.length>0) linkedPartner = [...linkedPartner, ...result]
    }
    return linkedPartner.length>0 ? {nfts: linkedPartner, ACL:1} : false
}

async function isInjectedUser(address) {
    console.log("AUTH :: Checking if Injected User")
    const user = await getInjectedUser(address)
    if(user.length>0) {
        const partnerData = await getPartner(user[0].partner)
        return {
            ACL: 2,
            partner: partnerData[0]
        }
    } else {
        return false
    }
}

async function isDelegatedAccess(address) {
    const delegations = await getWeb3().dc.getDelegationsByDelegate(address)
    console.log("dele", delegations)
}

//todo: sprawdź delegated
//todo: switch to SEPOLIA & TEST IT!!!
async function login(address) {
    //todo: add pagekey
    const { ownedNfts } = await getWeb3().eth.nft.getNftsForOwner(address)
    console.log("ownedNFT", ownedNfts)
    console.log("one", JSON.stringify(ownedNfts[0]))

    let type = await isWhale(ownedNfts)
    // if(!type) type = await isPartner(ownedNfts)
    // if(!type) type = await isInjectedUser(address)
    if(!type) type = await isDelegatedAccess(address)
    console.log("TYPE", type)
    return type
}

module.exports = { login }
