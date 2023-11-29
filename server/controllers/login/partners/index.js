const {loginFabwelt} = require("./fabweilt");
const {loginNexus} = require("./nexus");
const {loginSteadyStack} = require("./steadystack");
const {loginNeoTokyoBased} = require("../neotokyo");


async function isPartnerSpecial(nfts, partners, address) {
    let type = await loginNeoTokyoBased(nfts, partners)
    if (!type) type = await loginFabwelt(partners, address)
    if (!type) type = await loginNexus(nfts)
    if (!type) type = await loginSteadyStack(partners, address)

    return type
}


module.exports = {isPartnerSpecial}
