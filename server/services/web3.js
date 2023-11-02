const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const Web3Utils = require("web3-utils");
const {getEnv} = require("./db");
const Sentry = require("@sentry/nextjs");
let web3 = {}

function getWeb3 () {
    return web3
}

async function connectWeb3() {
    try {
        await Moralis.start({
            apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImZkMzQ0NTM4LTU2OWQtNDU5YS1iZDIzLTRiZDllNWM0OWE4MiIsIm9yZ0lkIjoiMTExNjI5IiwidXNlcklkIjoiMTExMjc1IiwidHlwZUlkIjoiMDA0M2NjYWYtOGVlMy00YTZmLTk4NmYtMjBlNTY3Y2VjZTUxIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTg5NDI0NzAsImV4cCI6NDg1NDcwMjQ3MH0.xf-8HxlKURtp4LeJ7yVDz66cF1ZELOFrhBTmfuksEJs",
        });

        const chains = getEnv().isDev ? [EvmChain.SEPOLIA, EvmChain.BSC_TESTNET, EvmChain.MUMBAI] : [EvmChain.ETHEREUM, EvmChain.BSC, EvmChain.POLYGON];

        web3 = {
            utils: Web3Utils,
            query: Moralis,
            chains,
        }
        console.log("|---- Web3: connected")

    } catch (err) {
        Sentry.captureException({location: "connectWeb3", err});
        console.error("Web3 connection failed.", err);
        process.exit(1);
    }
}

module.exports = { connectWeb3, getWeb3 }
