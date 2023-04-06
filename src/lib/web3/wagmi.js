import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

export const walletConnectProjectId = '84f532239022c91f95d4bdc6368957fa'

const { chains, provider, webSocketProvider } = configureChains(
    [mainnet],
    [publicProvider()],
)

export const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
})

export { chains }
