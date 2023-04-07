import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { polygon, mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'


const { chains, provider, webSocketProvider } = configureChains(
    [mainnet, polygon],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_API_ETH, priority: 0 }), publicProvider({priority: 1})],
    { stallTimeout: 5000 },
)

export const client = createClient({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({
            chains: [mainnet, polygon],
        }),
        new LedgerConnector({
            chains: [mainnet, polygon],
        }),
        new WalletConnectConnector({
            chains: [mainnet, polygon],
            options: {
                projectId: '84f532239022c91f95d4bdc6368957fa',
            },
        })
    ],
    provider,
})

export { chains }
