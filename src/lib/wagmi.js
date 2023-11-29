import {  createConfig, configureChains } from 'wagmi'
import { polygon, mainnet, bsc } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import {isBased} from "@/lib/utils";

// const rightChains = process.env.NEXT_PUBLIC_ENV !== 'production' ? [sepolia, polygonMumbai, bscTestnet] : [mainnet, polygon, bsc]
const rightChains = [mainnet, polygon, bsc]
const walletConnectProjectId = isBased ? 'fd985de17a4eed15096ed191f885cbcb' : '595f43a2eed724f824aa5ff2b5dc75c2'
const alchemyKey = 'hFR9b4iJDcH8CzddDlWJx40CaYaIcYSo'


const { chains,  publicClient, webSocketPublicClient } = configureChains(
    rightChains,
    [alchemyProvider({ apiKey: alchemyKey }), publicProvider()],
    { stallTimeout: 5000 },
)

const config = createConfig({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({
            chains: rightChains,
        }),
        new LedgerConnector({
            chains: rightChains,
            options: {
                projectId: walletConnectProjectId,
            },
            projectId: walletConnectProjectId,
        }),
        new WalletConnectConnector({
            chains: rightChains,
            options: {
                projectId: walletConnectProjectId,
            },
        }),
        new CoinbaseWalletConnector({
            chains: rightChains,
            options: {
                appName: isBased ? "basedVC" : "Citizen Capital",
                jsonRpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`,
            },
        })
    ],
    publicClient,
    webSocketPublicClient,
})

export { chains, config }
