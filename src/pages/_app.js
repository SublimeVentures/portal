import { useEffect, useState } from "react";
import { QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { useRouter } from "next/router";
import { config } from "@/lib/wagmi";
import { queryClient } from "@/lib/queryCache";
import { EnvironmentProvider } from "@/lib/context/EnvironmentContext";
import { TENANT } from "@/lib/tenantHelper";

import Layout from "@/components/Layout/Layout";
import Loader from "@/components/App/Loader";
import Gtag from "@/components/gtag";

import "react-tooltip/dist/react-tooltip.css";
import "@/styles/globals.scss";

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
}

export default function App({ Component, pageProps: { ...pageProps } }) {
    const router = useRouter();
    const [routeChangeInProgress, setRouteChangeInProgress] = useState(null);

    const { environmentData } = pageProps;

    useEffect(() => {
        document.getElementById('initPage').style.display = 'none';

        const handleRouteChange = (url) => {
            setRouteChangeInProgress(url)
        }

        const handleRouteChangeComplete = (...args) => {
            setRouteChangeInProgress(null)
        }

        router.events.on('routeChangeStart', handleRouteChange)
        router.events.on('routeChangeComplete', handleRouteChangeComplete)

        return () => {
            router.events.off('routeChangeStart', handleRouteChange)
            router.events.off('routeChangeComplete', handleRouteChangeComplete)
        }
    }, [router.events])

    const renderWithLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

    return (
        <>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <EnvironmentProvider initialData={environmentData}>
                        <HydrationBoundary state={pageProps.dehydratedState}>
                            {renderWithLayout(!!routeChangeInProgress ? <Loader {...pageProps}/> : <Component {...pageProps} />)}
                        </HydrationBoundary>
                    </EnvironmentProvider>
                </QueryClientProvider>
            </WagmiProvider>
            <Gtag />
        </>
    );
}
