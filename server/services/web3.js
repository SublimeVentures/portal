const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const Web3Utils = require("web3-utils");
const {getEnv} = require("./db/utils");
let web3 = {}

function getWeb3 () {
    return web3
}

async function connectWeb3() {
    try {
        await Moralis.start({
            apiKey: "Qs4I1cwoJD9uROTUX4ifIZQTdeldqjUPQM1UWhUQFwpYeYpqnlEhS8xLz5PIQqcq",
        });


        const chains = getEnv().isDev ? [EvmChain.SEPOLIA, EvmChain.BSC_TESTNET, EvmChain.MUMBAI] : [EvmChain.ETHEREUM, EvmChain.BSC, EvmChain.POLYGON];

        web3 = {
            utils: Web3Utils,
            query: Moralis,
            chains,
        }
        console.log("|---- Web3: connected")

    } catch (err) {
        console.error("Web3 connection failed.", err);
    }
}

module.exports = { connectWeb3, getWeb3 }
