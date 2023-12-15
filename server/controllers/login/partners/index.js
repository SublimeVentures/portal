const {loginFabwelt} = require("./fabweilt");
const {loginNexus} = require("./nexus");
const {loginSteadyStack} = require("./steadystack");
const {loginNeoTokyoBased} = require("../neotokyo");
const {loginEthlizards} = require("./ethlizards");


async function isPartnerSpecial(nfts, partners, address) {
    // let type = await loginNeoTokyoBased(nfts, partners)
    let type = await loginEthlizards(nfts)
    if (!type) type = await loginNeoTokyoBased(nfts, partners)
    if (!type) type = await loginFabwelt(partners, address)
    if (!type) type = await loginNexus(nfts)
    if (!type) type = await loginSteadyStack(partners, address)

    return type
}


module.exports = {isPartnerSpecial}
