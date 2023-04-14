import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { polygon, mainnet, sepolia, polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const rightChains = process.env.NEXT_PUBLIC_ENV === 'dev' ? [sepolia, polygonMumbai] : [mainnet, polygon]

const { chains, provider, webSocketProvider } = configureChains(
    rightChains,
    [alchemyProvider({ apiKey: process.env.ALCHEMY_API_ETH, priority: 0 }), publicProvider({priority: 1})],
    { stallTimeout: 5000 },
)

export const client = createClient({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({
            chains: rightChains,
        }),
        new LedgerConnector({
            chains: rightChains,
        }),
        new WalletConnectConnector({
            chains: rightChains,
            options: {
                projectId: '84f532239022c91f95d4bdc6368957fa',
            },
        })
    ],
    provider,
})

export { chains }
