const RPCs = {
    1: {
        main: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ETH_ALCHEMY_KEY}`,
        fallback1: `https://green-stylish-rain.quiknode.pro/${process.env.ETH_ALCHEMY_KEY_FALLBACK_1}/`,
        fallback2: `https://rpc.ankr.com/eth/${process.env.ETH_ALCHEMY_KEY_FALLBACK_2}`,
        fallback3: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ETH_ALCHEMY_KEY_FALLBACK_3}`,
    },
    56: {
        main: `https://rpc.ankr.com/bsc/${process.env.BINANCE_ALCHEMY_KEY}`,
        fallback1: `https://twilight-shy-spring.bsc.quiknode.pro/${process.env.BINANCE_ALCHEMY_KEY_FALLBACK_1}/`,
        fallback2: `https://light-evocative-ensemble.bsc.quiknode.pro/${process.env.BINANCE_ALCHEMY_KEY_FALLBACK_2}/`,
    },
    137: {
        main: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.POLYGON_ALCHEMY_KEY}`,
        fallback1: `https://rpc.ankr.com/polygon/${process.env.POLYGON_ALCHEMY_KEY_FALLBACK_1}`,
        fallback2: `https://snowy-cold-general.matic.quiknode.pro/${process.env.POLYGON_ALCHEMY_KEY_FALLBACK_2}/`,
        fallback3: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.POLYGON_ALCHEMY_KEY_FALLBACK_3}`,
    },
    43114: {
        main: `https://cosmopolitan-rough-dream.avalanche-mainnet.quiknode.pro/${process.env.AVALANCHE_ALCHEMY_KEY}/ext/bc/C/rpc/`,
        fallback1: `https://rpc.ankr.com/avalanche/${process.env.AVALANCHE_ALCHEMY_KEY}`,
        fallback2: `https://late-solemn-mansion.avalanche-mainnet.quiknode.pro/${process.env.AVALANCHE_ALCHEMY_KEY}/ext/bc/C/rpc/`,
    },
    11155111: {
        main: `https://eth-sepolia.g.alchemy.com/v2/${process.env.SEPOLIA_ALCHEMY_KEY}`,
    },
    84532: {
        main: `https://base-sepolia.g.alchemy.com/v2/${process.env.BASE_SEPOLIA_ALCHEMY_KEY}`,
    },
};

const KNOWN_CONNECTORS = ["Coinbase Wallet", "Ledger", "MetaMask", "WalletConnect"];

export { RPCs, KNOWN_CONNECTORS };
