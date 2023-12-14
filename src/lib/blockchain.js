import {isBased} from "@/lib/utils";

const ALCHEMY_KEY = 'u2zi788MkJexUSsl4DUSFmnTQP7ZIKh'

const RPCs = {
    1: {
        http:'https://eth-mainnet.g.alchemy.com/v2/-u2zi788MkJexUSsl4DUSFmnTQP7ZIKh',
        webSocket:'wss://eth-mainnet.g.alchemy.com/v2/-u2zi788MkJexUSsl4DUSFmnTQP7ZIKh',
    },
    56: {
        http:'https://twilight-shy-spring.bsc.quiknode.pro/52893022532b2a5b19afc453d6233982c4441be1/',
        webSocket:'wss://twilight-shy-spring.bsc.quiknode.pro/52893022532b2a5b19afc453d6233982c4441be1/',
    },
    137: {
        http:'https://polygon-mainnet.g.alchemy.com/v2/cMJRBIRaZVsM17-mD4Fhhp4TlP3cnqhg',
        webSocket:'wss://polygon-mainnet.g.alchemy.com/v2/cMJRBIRaZVsM17-mD4Fhhp4TlP3cnqhg',
    }
}

const WALLET_CONNECT_ID = isBased ? 'fd985de17a4eed15096ed191f885cbcb' : '595f43a2eed724f824aa5ff2b5dc75c2'
const KNOWN_CONNECTORS = ['Coinbase Wallet', 'Ledger', 'MetaMask', 'WalletConnect'];


export { RPCs, WALLET_CONNECT_ID, ALCHEMY_KEY, KNOWN_CONNECTORS }
