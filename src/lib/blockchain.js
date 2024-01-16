import {isBased} from "@/lib/utils";

const RPCs = {
    1: {
        main:'https://eth-mainnet.g.alchemy.com/v2/-u2zi788MkJexUSsl4DUSFmnTQP7ZIKh',
        fallback:'https://eth-mainnet.g.alchemy.com/v2/13KwZtTNTa21OQZiapO7_uUgvCacLZcO',
    },
    56: {
        main:'https://twilight-shy-spring.bsc.quiknode.pro/52893022532b2a5b19afc453d6233982c4441be1/',
        fallback:'https://alien-young-firefly.bsc.quiknode.pro/2992415a541b3d7a57767f625713915d52b46030/',
    },
    137: {
        main:'https://polygon-mainnet.g.alchemy.com/v2/cMJRBIRaZVsM17-mD4Fhhp4TlP3cnqhg',
        fallback:'https://polygon-mainnet.g.alchemy.com/v2/FuElfvJibpbYOz1NRpz31H3GX9GhZjsC',
    }
}

const WALLET_CONNECT_ID = isBased ? 'fd985de17a4eed15096ed191f885cbcb' : '595f43a2eed724f824aa5ff2b5dc75c2'
const KNOWN_CONNECTORS = ['Coinbase Wallet', 'Ledger', 'MetaMask', 'WalletConnect'];


export { RPCs, WALLET_CONNECT_ID, KNOWN_CONNECTORS }
