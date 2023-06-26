import {WagmiConfig} from 'wagmi'
import {Hydrate, QueryClientProvider} from '@tanstack/react-query'
import {client} from '@/lib/wagmi'
import {queryClient} from '@/lib/queryCache'
import Layout from '@/components/Layout/Layout';
import 'react-tooltip/dist/react-tooltip.css';
import '@/styles/globals.scss'
import {is3VC} from "@/lib/seoConfig";

if (is3VC){
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
        <WagmiConfig client={client}>
            {renderWithLayout(
                    <QueryClientProvider client={queryClient}>
                        <Hydrate state={pageProps.dehydratedState}>
                            <Component  {...pageProps} />
                        </Hydrate>
                    </QueryClientProvider>
            )}
        </WagmiConfig>
    );

}
