import {  createConfig, configureChains } from 'wagmi'
import { polygon, mainnet, bsc } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import {isBased} from "@/lib/utils";
import {ALCHEMY_KEY, RPCs, WALLET_CONNECT_ID} from "@/lib/blockchain";
import {createWalletClient, custom, publicActions} from "viem";

// const rightChains = process.env.NEXT_PUBLIC_ENV !== 'production' ? [sepolia, polygonMumbai, bscTestnet] : [mainnet, polygon, bsc]
const rightChains = [mainnet, polygon, bsc]

const { chains,  publicClient, webSocketPublicClient } = configureChains(
    rightChains,
    [
        jsonRpcProvider({
            rpc: (chain) => ({
                http: RPCs[chain.id].http,
                webSocket: RPCs[chain.id].webSocket,
            }),
        }),
        publicProvider()
    ],
    { stallTimeout: 5000, retryCount: 5},
)

const config = createConfig({
    autoConnect: true,
    connectors: [
        new InjectedConnector({
            chains: rightChains,
        }),
        new MetaMaskConnector({
            chains: rightChains,
        }),
        new LedgerConnector({
            chains: rightChains,
            options: {
                projectId: WALLET_CONNECT_ID,
            },
            projectId: WALLET_CONNECT_ID,
        }),
        new WalletConnectConnector({
            chains: rightChains,
            options: {
                projectId: WALLET_CONNECT_ID,
            },
        }),
        new CoinbaseWalletConnector({
            chains: rightChains,
            options: {
                appName: isBased ? "basedVC" : "Citizen Capital",
                jsonRpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
            },
        })
    ],
    publicClient: (chain) => {
        if (typeof window !== 'undefined' && typeof (window).ethereum !== 'undefined') {
            // create a special client that sends rpc calls through wallet
            return createWalletClient({
                chain: chain,
                transport: custom(window.ethereum),
        }).extend(publicActions);
        }

        return publicClient(chain)
    },
    webSocketPublicClient,
})

export { chains, config }
