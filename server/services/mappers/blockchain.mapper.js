/**
 * @typedef {object} ChainItem
 * @property {string} name Blockchain name
 * @property {string} currency Blockchain currency shorthand
 * @property {string} scannerName Name of the scanner service associated with the blockchain
 * @property {string} scannerUrl URL of the scanner service associated with the blockchain
 */

/**
 * @param {number} chainId ID of the blockchain
 * @returns {ChainItem}
 */
export function mapChainIdToNameWithScanner(chainId) {
    return chainMap[chainId];
}

/**
 * @type {Record<number, ChainItem>}
 */
const chainMap = {
    1: {
        name: "Ethereum",
        currency: "ETH",
        scannerName: "EtherScan",
        scannerUrl: "https://etherscan.io",
    },
    56: {
        name: "BNB Smart Chain",
        currency: "BSC",
        scannerName: "BSCScan",
        scannerUrl: "https://bscscan.com",
    },
    137: {
        name: "Polygon",
        currency: "MATIC",
        scannerName: "PolygonScan",
        scannerUrl: "https://polygonscan.com",
    },
    11155111: {
        name: "Sepolia",
        currency: "ETH",
        scannerName: "Sepolia EtherScan",
        scannerUrl: "https://sepolia.etherscan.io",
    },
    84532: {
        name: "Base Sepolia",
        currency: "ETH",
        scannerName: "",
        scannerUrl: "",
    },
    8453: {
        name: "Base",
        currency: "ETH",
        scannerName: "",
        scannerUrl: "",
    },
};
