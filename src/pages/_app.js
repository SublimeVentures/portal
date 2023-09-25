import {WagmiConfig} from 'wagmi'
import {Hydrate, QueryClientProvider} from '@tanstack/react-query'
import {config} from '@/lib/wagmi'
import {queryClient} from '@/lib/queryCache'
import Layout from '@/components/Layout/Layout';
import 'react-tooltip/dist/react-tooltip.css';
import '@/styles/globals.scss'
import {isBased} from "@/lib/utils";
import Gtag from "@/components/gtag";

if (isBased){
    import('@/styles/tenants/basedVC.scss')
} else {
    import('@/styles/tenants/citcap.scss')
}

export default function App({Component, pageProps: {...pageProps}}) {

    const renderWithLayout =
        Component.getLayout ||
        function (page) {
            return <Layout>{page}</Layout>;
        };

    return (
        <>
            <WagmiConfig config={config}>
                {renderWithLayout(
                    <QueryClientProvider client={queryClient}>
                        <Hydrate state={pageProps.dehydratedState}>
                            <Component  {...pageProps} />
                        </Hydrate>
                    </QueryClientProvider>
                )}
            </WagmiConfig>
            <Gtag/>
        </>


);

}
