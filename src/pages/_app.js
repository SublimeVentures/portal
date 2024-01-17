import {QueryClientProvider, HydrationBoundary} from '@tanstack/react-query'
import {WagmiProvider} from 'wagmi'
import {config} from '@/lib/wagmi'
import {queryClient} from "@/lib/queryCache";

import Layout from '@/components/Layout/Layout';
import 'react-tooltip/dist/react-tooltip.css';
import '@/styles/globals.scss'

import Gtag from "@/components/gtag";
import {EnvironmentProvider} from "@/components/App/BlockchainSteps/EnvironmentContext";

import {isBased} from "@/lib/utils";

if (isBased) {
    import('@/styles/tenants/basedVC.scss')
} else {
    import('@/styles/tenants/citcap.scss')
}

export default function App({Component, pageProps: {...pageProps}}) {
    const {environmentData} = pageProps;
    const renderWithLayout = Component.getLayout || (page => <Layout>{page}</Layout>);

    return (
        <>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <EnvironmentProvider initialData={environmentData}>
                        <HydrationBoundary state={pageProps.dehydratedState}>
                            {renderWithLayout(
                                <Component  {...pageProps} />
                            )}
                        </HydrationBoundary>
                    </EnvironmentProvider>
                </QueryClientProvider>
            </WagmiProvider>
            <Gtag/>
        </>
    );
}
