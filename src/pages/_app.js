import { HydrationBoundary, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Toaster } from "react-hot-toast";
import { config } from "@/lib/wagmi";
import { queryClient } from "@/lib/queryCache";

import Layout from "@/components/Layout/Layout";
import "react-tooltip/dist/react-tooltip.css";
import "@/styles/globals.scss";

import Gtag from "@/components/gtag";
import { EnvironmentProvider } from "@/lib/context/EnvironmentContext";

import { TENANT } from "@/lib/tenantHelper";
import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import Push from "@/components/Push";

switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
    case TENANT.basedVC: {
        import("@/styles/tenants/basedVC.scss");
        break;
    }
    case TENANT.NeoTokyo: {
        import("@/styles/tenants/citcap.scss");
        break;
    }
    case TENANT.CyberKongz: {
        import("@/styles/tenants/cyberkongz.scss");
        break;
    }
    case TENANT.BAYC: {
        import("@/styles/tenants/bayc.scss");
        break;
    }
}

export default function App({ Component, pageProps: { ...pageProps } }) {
    const { environmentData } = pageProps;
    const renderWithLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

    return (
        <>
            <ClientErrorBoundary>
                <WagmiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                        <EnvironmentProvider initialData={environmentData}>
                            <HydrationBoundary state={pageProps.dehydratedState}>
                                {renderWithLayout(<Component {...pageProps} />)}
                            </HydrationBoundary>
                        </EnvironmentProvider>
                    </QueryClientProvider>
                </WagmiProvider>
            </ClientErrorBoundary>
            <Gtag />
            <Push />
            <Toaster position="top-right" gutter={15} />
        </>
    );
}
