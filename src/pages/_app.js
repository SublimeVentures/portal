import {WagmiConfig} from 'wagmi'
import axios from 'axios';
import {Hydrate, QueryClientProvider} from '@tanstack/react-query'
import {client} from '@/lib/wagmi'
import {queryClient} from '@/lib/queryCache'
import Layout from '@/components/Layout/Layout';
import 'react-tooltip/dist/react-tooltip.css';
import '@/styles/globals.scss'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL;


export default function App({Component, pageProps: {session, ...pageProps}}) {
    const renderWithLayout =
        Component.getLayout ||
        function (page) {
            return <Layout>{page}</Layout>;
        };

    return (
        <WagmiConfig client={client}>
            {/*<SessionProvider session={session}>*/}
            {renderWithLayout(
                    <QueryClientProvider client={queryClient}>
                        <Hydrate state={pageProps.dehydratedState}>
                            <Component  {...pageProps} />
                        </Hydrate>
                    </QueryClientProvider>
            )}
            {/*</SessionProvider>*/}
        </WagmiConfig>
    );

}
