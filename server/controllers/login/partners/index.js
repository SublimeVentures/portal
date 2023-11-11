const {loginFabwelt} = require("./fabweilt");
const {loginNexus} = require("./nexus");
const {loginSteadyStack} = require("./steadystack");


async function isPartnerSpecial(nfts, partners, address) {
    let type = await loginFabwelt(partners, address)
    if (!type) type = await loginNexus(nfts, partners)
    if (!type) type = await loginSteadyStack(partners, address)

    return type
}


module.exports = {isPartnerSpecial}
