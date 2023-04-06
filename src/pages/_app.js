import '@/styles/globals.scss'
import { WagmiConfig } from 'wagmi'
import Layout from '@/components/Layout/Layout';
import {
    Hydrate,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

import { chains, client, walletConnectProjectId } from '@/lib/web3/wagmi'
import axios from 'axios';
import {useState} from "react";

axios.defaults.baseURL = 'http://localhost:3000';

export default function App({ Component, pageProps }) {
    const [queryClient] = useState(() => new QueryClient())

    const renderWithLayout =
        Component.getLayout ||
        function (page) {
            return <Layout>{page}</Layout>;
        };

  return renderWithLayout(
      <WagmiConfig client={client}>
          <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                  <Component  {...pageProps} />
              </Hydrate>
          </QueryClientProvider>
      </WagmiConfig>
  );
}
