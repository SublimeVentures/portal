const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const Web3Utils = require("web3-utils");
const {getEnv} = require("./db");
const Sentry = require("@sentry/nextjs");
const { Web3, Contract } = require('web3');
const citcapStakingAbi = require("../../abi/citcapStaking.abi.json");

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

        const web3_eth = new Web3("https://eth-mainnet.g.alchemy.com/v2/hFR9b4iJDcH8CzddDlWJx40CaYaIcYSo");
        const web3_matic = new Web3("https://polygon-mainnet.g.alchemy.com/v2/LGFrOk_xVcd4h5UxcKbNTQgvYTMDONmz");
        const web3_bsc = new Web3("https://light-evocative-ensemble.bsc.quiknode.pro/ece694054859b2a5bd2d2fc2fd577441977229fc/");
        const contract_citcap = new Contract(citcapStakingAbi, getEnv().diamond['1'], web3_eth);


        web3 = {
            utils: Web3Utils,
            query: Moralis,
            chains,
            onchain: {
                eth: web3_eth,
                matic: web3_matic,
                bsc: web3_bsc
            },
            contracts: {
                citcap: contract_citcap
            }
        }
        console.log("|---- Web3: connected")

    } catch (err) {
        Sentry.captureException({location: "connectWeb3", err});
        console.error("Web3 connection failed.", err);
        process.exit(1);
    }
}

module.exports = { connectWeb3, getWeb3 }
