import { useEffect } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { dehydrate, useQuery } from "@tanstack/react-query";
import { seoConfig } from "@/lib/seoConfig";
import { fetchPartners } from "@/fetchers/public.fecher";
import { useTenantSpecificData, TENANT } from "@/v2/helpers/tenant";
import PAGE from "@/routes";
import { queryClient } from "@/lib/queryCache";
import { verifyID } from "@/lib/authHelpers";
import ErrorProvider from "@/components/SignupFlow/ErrorProvider";

const renderLogin = (componentName, data) => {
    const TenantComponent = dynamic(() => import(`@/components/Login/${componentName}`), { ssr: true });
    return <TenantComponent ssrData={data} />;
};

export default function Login({ isAuthenticated }) {
    const router = useRouter();
    const seo = seoConfig(PAGE.Login);
    const { components } = useTenantSpecificData();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace(PAGE.App);
        }
    }, [isAuthenticated, router]);

    const { data } = useQuery({
        queryKey: ["partnerList"],
        queryFn: fetchPartners,
        cacheTime: 180 * 60 * 1000,
        staleTime: 90 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return (
        <ErrorProvider>
            <NextSeo
                title={seo.title}
                description={seo.description}
                canonical={seo.url}
                openGraph={seo.og}
                twitter={seo.twitter}
            />

            {renderLogin(components.login, data)}
        </ErrorProvider>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    const account = await verifyID(req);

    await queryClient.prefetchQuery({
        queryKey: ["partnerList"],
        queryFn: fetchPartners,
        cacheTime: 180 * 60 * 1000,
        staleTime: 90 * 60 * 1000,
    });

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            isAuthenticated: account.auth,
        },
    };
};
