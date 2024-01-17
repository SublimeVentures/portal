import {http, createConfig, fallback } from 'wagmi'
import { mainnet, polygon, bsc } from 'wagmi/chains'
import { coinbaseWallet, walletConnect } from 'wagmi/connectors'
import {RPCs, WALLET_CONNECT_ID} from "@/lib/blockchain";

const retryOptions = {
    retryCount: 7,
    retryDelay: 150,
    timeout: 10_000,
    batch: true
}

const fallbackOptions = {
    retryCount: 5,
    retryDelay: 150,
}

export const config = createConfig({
    chains: [mainnet, polygon, bsc],
    batch: { multicall: true },
    cacheTime: 1_000, //default: 4_000
    pollingInterval: 4_000,
    ssr: true,
    connectors: [
        // metaMask(),
        walletConnect({
            projectId: WALLET_CONNECT_ID,
        }),
        coinbaseWallet({
            appName: 'Venture Capital',
        }),
    ],
    transports: {
        [mainnet.id]: fallback([
            http(RPCs[mainnet.id].main, retryOptions),
            http(RPCs[mainnet.id].fallback, retryOptions),
        ], fallbackOptions),
        [polygon.id]: fallback([
            http(RPCs[polygon.id].main, retryOptions),
            http(RPCs[polygon.id].fallback, retryOptions),
        ], fallbackOptions),
        [bsc.id]: fallback([
            http(RPCs[bsc.id].main, retryOptions),
            http(RPCs[bsc.id].fallback, retryOptions),
        ], fallbackOptions),
    },
})
