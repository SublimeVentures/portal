const RPCs = {
    1: {
        main: "https://eth-mainnet.g.alchemy.com/v2/-u2zi788MkJexUSsl4DUSFmnTQP7ZIKh",
        fallback1: "https://green-stylish-rain.quiknode.pro/461e21be0b42fd335152db41aafb3ad76cd0b4a9/",
        fallback2: "https://rpc.ankr.com/eth/650887a823beb18b6898043c82c50269153b7bc6c4f604068bfa35abf4fefa02",
        fallback3: "https://eth-mainnet.g.alchemy.com/v2/13KwZtTNTa21OQZiapO7_uUgvCacLZcO",
    },
    56: {
        main: "https://rpc.ankr.com/bsc/650887a823beb18b6898043c82c50269153b7bc6c4f604068bfa35abf4fefa02",
        fallback1: "https://twilight-shy-spring.bsc.quiknode.pro/52893022532b2a5b19afc453d6233982c4441be1/",
        fallback2: "https://light-evocative-ensemble.bsc.quiknode.pro/ece694054859b2a5bd2d2fc2fd577441977229fc/",
    },
    137: {
        main: "https://polygon-mainnet.g.alchemy.com/v2/cMJRBIRaZVsM17-mD4Fhhp4TlP3cnqhg",
        fallback1: "https://rpc.ankr.com/polygon/650887a823beb18b6898043c82c50269153b7bc6c4f604068bfa35abf4fefa02",
        fallback2: "https://snowy-cold-general.matic.quiknode.pro/ef4093d59090cea515d612a18380e69aaeda42e4/",
        fallback3: "https://polygon-mainnet.g.alchemy.com/v2/FuElfvJibpbYOz1NRpz31H3GX9GhZjsC",
    },
    43114: {
        main: "https://cosmopolitan-rough-dream.avalanche-mainnet.quiknode.pro/948ecd999cc2729ab0d0738ed191fa9a234df346/ext/bc/C/rpc/",
        fallback1: "https://rpc.ankr.com/avalanche/650887a823beb18b6898043c82c50269153b7bc6c4f604068bfa35abf4fefa02",
        fallback2:
            "https://late-solemn-mansion.avalanche-mainnet.quiknode.pro/42db2654cb19ee23c3fc9b8a78bb3c33e22d141c/ext/bc/C/rpc/",
    },
};

const KNOWN_CONNECTORS = ["Coinbase Wallet", "Ledger", "MetaMask", "WalletConnect"];

export { RPCs, KNOWN_CONNECTORS };
