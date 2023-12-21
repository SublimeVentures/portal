import {isBased} from "@/lib/utils";

const ALCHEMY_KEY = 'u2zi788MkJexUSsl4DUSFmnTQP7ZIKh'

const RPCs = {
    1: {
        http1:'https://eth-mainnet.g.alchemy.com/v2/-u2zi788MkJexUSsl4DUSFmnTQP7ZIKh',
        webSocket1:'wss://eth-mainnet.g.alchemy.com/v2/-u2zi788MkJexUSsl4DUSFmnTQP7ZIKh',
        http2:'https://eth-mainnet.g.alchemy.com/v2/13KwZtTNTa21OQZiapO7_uUgvCacLZcO',
        webSocket2:'wss://eth-mainnet.g.alchemy.com/v2/13KwZtTNTa21OQZiapO7_uUgvCacLZcO',
    },
    56: {
        http1:'https://twilight-shy-spring.bsc.quiknode.pro/52893022532b2a5b19afc453d6233982c4441be1/',
        webSocket1:'wss://twilight-shy-spring.bsc.quiknode.pro/52893022532b2a5b19afc453d6233982c4441be1/',
        http2:'https://alien-young-firefly.bsc.quiknode.pro/2992415a541b3d7a57767f625713915d52b46030/',
        webSocket2:'wss://alien-young-firefly.bsc.quiknode.pro/2992415a541b3d7a57767f625713915d52b46030/',
    },
    137: {
        http1:'https://polygon-mainnet.g.alchemy.com/v2/cMJRBIRaZVsM17-mD4Fhhp4TlP3cnqhg',
        webSocket1:'wss://polygon-mainnet.g.alchemy.com/v2/cMJRBIRaZVsM17-mD4Fhhp4TlP3cnqhg',
        http2:'https://polygon-mainnet.g.alchemy.com/v2/FuElfvJibpbYOz1NRpz31H3GX9GhZjsC',
        webSocke2:'wss://polygon-mainnet.g.alchemy.com/v2/FuElfvJibpbYOz1NRpz31H3GX9GhZjsC',
    }
}

const WALLET_CONNECT_ID = isBased ? 'fd985de17a4eed15096ed191f885cbcb' : '595f43a2eed724f824aa5ff2b5dc75c2'
const KNOWN_CONNECTORS = ['Coinbase Wallet', 'Ledger', 'MetaMask', 'WalletConnect'];


export { RPCs, WALLET_CONNECT_ID, ALCHEMY_KEY, KNOWN_CONNECTORS }
