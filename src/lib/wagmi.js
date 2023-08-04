import {  createClient, configureChains } from 'wagmi'
import { polygon, mainnet, sepolia, polygonMumbai, bscTestnet, bsc } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import {isBased} from "@/lib/utils";

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
                projectId: 'a4088d35288a7c0dcdb3d588657922ee',
            },
        }),
        new CoinbaseWalletConnector({
            chains: rightChains,
            options: {
                appName: isBased ? "basedVC" : "Citizen Capital",
                jsonRpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/ca5Ej0RH2MKn3Y6eGDN4Di6GEWao0aWL',
            },
        })
    ],
    provider,
})

export { chains }
