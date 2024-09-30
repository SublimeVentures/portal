import { WagmiProvider } from "wagmi";
import { HydrationBoundary, QueryClientProvider } from "@tanstack/react-query";

import Head from "next/head";
import { TooltipProvider } from "@/v2/components/ui/tooltip";
import { TENANT } from "@/v2/helpers/tenant";
import Layout from "@/components/Layout/Layout";
import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import Gtag from "@/components/gtag";
import { config } from "@/lib/wagmi";
import { EnvironmentProvider } from "@/lib/context/EnvironmentContext";
import { queryClient } from "@/lib/queryCache";
import "react-tooltip/dist/react-tooltip.css";
import "@/v2/styles/globals.scss";
import font from "@/v2/lib/font";

export default function App({ Component, pageProps: { ...pageProps } }) {
    const { environmentData } = pageProps;
    const renderWithLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

    return (
        <>
            <Head>
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                        :root {
                            --base-font: ${font.style.fontFamily};
                        }`,
                    }}
                />
            </Head>
            <ClientErrorBoundary>
                <WagmiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                        <EnvironmentProvider initialData={environmentData}>
                            <TooltipProvider>
                                <HydrationBoundary state={pageProps.dehydratedState}>
                                    {renderWithLayout(<Component {...pageProps} />)}
                                </HydrationBoundary>
                            </TooltipProvider>
                        </EnvironmentProvider>
                    </QueryClientProvider>
                </WagmiProvider>
            </ClientErrorBoundary>
            <Gtag />
        </>
    );
}
