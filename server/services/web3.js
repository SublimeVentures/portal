const mongoose = require("mongoose");
const {getEnvironment} = require("../queries/environment");
const { Alchemy, Network } = require('alchemy-sdk');
const Web3Utils = require("web3-utils");
let web3 = {}

function getWeb3 () {
    return web3
}

async function connectWeb3() {
    try {
        // PROD
        const configETH_prod = {
            apiKey: process.env.ALCHEMY_ETH,
            network: Network.ETH_MAINNET,
        };
        const configMATIC_prod = {
            apiKey: process.env.ALCHEMY_MATIC,
            network: Network.MATIC_MAINNET,
            maxRetries: 10
        };
        // DEV
        const configETH_dev = {
            apiKey: process.env.ALCHEMY_ETH,
            network: Network.ETH_SEPOLIA,
        };
        const configMATIC_dev = {
            apiKey: process.env.ALCHEMY_MATIC,
            network: Network.MATIC_MAINNET,
            maxRetries: 10
        };

        const web3_eth =  new Alchemy(process.env.NODE_ENV==='dev' ? configETH_dev : configETH_prod);
        console.log("|---- Blockchain ETH: OK")

        const web3_matic =  new Alchemy(process.env.NODE_ENV==='dev' ? configMATIC_dev : configMATIC_prod);
        console.log("|---- Blockchain MATIC: OK")

        // const ethProvider = await web3_eth.config.getHttpProvider();

        web3 = {
            utils: Web3Utils,
            matic: web3_matic,
            eth: web3_eth,
        }
        console.log("|---- Web3: connected")

    } catch (err) {
        console.error("DB connection failed.", err);
    }
}

module.exports = { connectWeb3, getWeb3 }
