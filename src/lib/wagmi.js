import {  createClient, configureChains } from 'wagmi'
import { polygon, mainnet, sepolia, polygonMumbai, bscTestnet, bsc } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const rightChains = process.env.NEXT_PUBLIC_ENV !== 'production' ? [sepolia, polygonMumbai, bscTestnet] : [mainnet, polygon, bsc]


const { chains, provider } = configureChains(
    rightChains,
    [publicProvider()],
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
