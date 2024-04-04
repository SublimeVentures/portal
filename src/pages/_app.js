import { useEffect, useState } from "react";
import { QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { useRouter } from "next/router";
import { config } from "@/lib/wagmi";
import { queryClient } from "@/lib/queryCache";
import { EnvironmentProvider } from "@/lib/context/EnvironmentContext";
import { TENANT } from "@/lib/tenantHelper";

import Layout from "@/components/Layout/Layout";
import Gtag from "@/components/gtag";

import "react-tooltip/dist/react-tooltip.css";
import "@/styles/globals.scss";
import ContainerLoader from "@/components/ContainerLoader";
import { getContainerLoaderLayout } from "@/components/ContainerLoader/helper";

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
    const [urlTransitionString, setUrlTransitionString] = useState(null);

    const { environmentData } = pageProps;

    useEffect(() => {
        document.getElementById("initPage").style.display = "none";

        const handleRouteChange = (url) => {
            setUrlTransitionString(url.split("?")[0]);
        };

        const handleRouteChangeComplete = () => {
            setUrlTransitionString(null);
        };

        router.events.on("routeChangeStart", handleRouteChange);
        router.events.on("routeChangeComplete", handleRouteChangeComplete);

        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
            router.events.off("routeChangeComplete", handleRouteChangeComplete);
        };
    }, [router.events]);

    const containerLayout = getContainerLoaderLayout(urlTransitionString, router.pathname);

    const renderWithLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

    return (
        <>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <EnvironmentProvider initialData={environmentData}>
                        <HydrationBoundary state={pageProps.dehydratedState}>
                            {urlTransitionString
                                ? containerLayout(
                                      <ContainerLoader
                                          currentPathName={router.pathname}
                                          containerUrl={urlTransitionString}
                                          {...pageProps}
                                      />,
                                  )
                                : renderWithLayout(<Component {...pageProps} />)}
                        </HydrationBoundary>
                    </EnvironmentProvider>
                </QueryClientProvider>
            </WagmiProvider>
            <Gtag />
        </>
    );
}
