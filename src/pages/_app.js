import {SessionProvider} from "next-auth/react"
import {WagmiConfig} from 'wagmi'
import axios from 'axios';
import {Hydrate, QueryClientProvider} from '@tanstack/react-query'
import {client} from '@/lib/web3/wagmi'
import {queryClient} from '@/lib/web3/queryCache'
import Layout from '@/components/Layout/Layout';
import 'react-tooltip/dist/react-tooltip.css';
import '@/styles/globals.scss'

axios.defaults.baseURL = 'http://localhost:3000';


export default function App({Component, pageProps: {session, ...pageProps}}) {
    const renderWithLayout =
        Component.getLayout ||
        function (page) {
            return <Layout>{page}</Layout>;
        };

    return (
        <WagmiConfig client={client}>
            {renderWithLayout(
                <SessionProvider session={session}>
                    <QueryClientProvider client={queryClient}>
                        <Hydrate state={pageProps.dehydratedState}>
                            <Component  {...pageProps} />
                        </Hydrate>
                    </QueryClientProvider>
                </SessionProvider>
            )}
        </WagmiConfig>
    );
    // return renderWithLayout(
    //     <WagmiConfig client={client}>
    //         <SessionProvider session={session}>
    //             <QueryClientProvider client={queryClient}>
    //                 <Hydrate state={pageProps.dehydratedState}>
    //                     <Component  {...pageProps} />
    //                 </Hydrate>
    //             </QueryClientProvider>
    //         </SessionProvider>
    //     </WagmiConfig>
    // );
}
