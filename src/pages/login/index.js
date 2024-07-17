import { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { dehydrate, useQuery } from "@tanstack/react-query";

import { fetchPartners } from "@/fetchers/public.fecher";
import { useTenantSpecificData } from "@/v2/helpers/tenant";
import PAGE from "@/routes";
import { queryClient } from "@/lib/queryCache";
import { verifyID } from "@/lib/authHelpers";
import ErrorModal from "@/components/SignupFlow/ErrorModal";
import { LoginErrorsEnum } from "@/constants/enum/login.enum";

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
            router.replace("/app");
        }
    }, []);

    const { data } = useQuery({
        queryKey: ["partnerList"],
        queryFn: fetchPartners,
        cacheTime: 180 * 60 * 1000,
        staleTime: 90 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return (
        <>
            <NextSeo
                title={seo.title}
                description={seo.description}
                canonical={seo.url}
                openGraph={seo.og}
                twitter={seo.twitter}
            />

            {renderLogin(components.login, data)}
            <ErrorModal model={errorModal} setter={() => setErrorModal(false)} />
        </>
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
