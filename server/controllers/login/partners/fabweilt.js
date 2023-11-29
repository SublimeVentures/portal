const {getWeb3} = require("../../../services/web3");
const {NETWORKS} = require("../../../../src/lib/utils");
const {ACLs} = require("../../../../src/lib/authHelpers");
const erc20_abi = require('../../../../abi/usdt.abi.json')
const { Contract } = require('web3');

async function haveBalance(address, partner) {
    const web3 = getWeb3().onchain[NETWORKS[partner.chainId]];
    const contractInstance = new Contract(erc20_abi, partner.address, web3);

    try {
        const balance = await contractInstance.methods.balanceOf(address).call();
        return Number(getWeb3().utils.fromWei(`${balance.toString()}`));
    } catch (error) {

        return 0
    }
}


async function loginFabwelt(partners, address) {
    const partnersFiltered = partners.filter(el => el.level === 12)

    if(!partnersFiltered) return false;

    const partnerDetails = partnersFiltered[0]
    const amountRequired = partnerDetails.metadataVal[partnerDetails.metadataProp]
    let totalOwned = 0;

    for (const partner of partnersFiltered) {
        let owned = await haveBalance(address, partner);
        // let ownedStaked = await haveBalanceStaked(address, partner);
        // console.log("owned on", partner['network.name'], ":", owned);
        // console.log("owned staked on", partner['network.name'], ":", ownedStaked);

        if (owned) {
            totalOwned += owned;
            // totalOwned += ownedStaked;
            if(totalOwned > amountRequired) {
                break;
            }
        }
    }

    if (totalOwned < amountRequired) {
        return false;
    }


    return {
        symbol: partnerDetails.symbol,
        multi: partnerDetails.multiplier,
        img: partnerDetails.logo,
        img_fallback: partnerDetails.logo,
        id: Number(`20${totalOwned}`),
        ACL: ACLs.Partner
    }
}


module.exports = {loginFabwelt}
