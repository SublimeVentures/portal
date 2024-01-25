import {isBased} from "@/lib/utils";

const RPCs = {
    1: {
        main:'https://eth-mainnet.g.alchemy.com/v2/-u2zi788MkJexUSsl4DUSFmnTQP7ZIKh',
        fallback1:'https://green-stylish-rain.quiknode.pro/461e21be0b42fd335152db41aafb3ad76cd0b4a9/',
        fallback2:'https://rpc.ankr.com/eth/650887a823beb18b6898043c82c50269153b7bc6c4f604068bfa35abf4fefa02',
        fallback3:'https://eth-mainnet.g.alchemy.com/v2/13KwZtTNTa21OQZiapO7_uUgvCacLZcO',
    },
    56: {
        main:'https://rpc.ankr.com/bsc/650887a823beb18b6898043c82c50269153b7bc6c4f604068bfa35abf4fefa02',
        fallback1:'https://twilight-shy-spring.bsc.quiknode.pro/52893022532b2a5b19afc453d6233982c4441be1/',
        fallback2:'https://light-evocative-ensemble.bsc.quiknode.pro/ece694054859b2a5bd2d2fc2fd577441977229fc/',
    },
    137: {
        main:'https://polygon-mainnet.g.alchemy.com/v2/cMJRBIRaZVsM17-mD4Fhhp4TlP3cnqhg',
        fallback1:'https://rpc.ankr.com/polygon/650887a823beb18b6898043c82c50269153b7bc6c4f604068bfa35abf4fefa02',
        fallback2:'https://snowy-cold-general.matic.quiknode.pro/ef4093d59090cea515d612a18380e69aaeda42e4/',
        fallback3:'https://polygon-mainnet.g.alchemy.com/v2/FuElfvJibpbYOz1NRpz31H3GX9GhZjsC',
    }
}

const WALLET_CONNECT_ID = isBased ? 'fd985de17a4eed15096ed191f885cbcb' : '595f43a2eed724f824aa5ff2b5dc75c2'
const KNOWN_CONNECTORS = ['Coinbase Wallet', 'Ledger', 'MetaMask', 'WalletConnect'];


export { RPCs, WALLET_CONNECT_ID, KNOWN_CONNECTORS }
