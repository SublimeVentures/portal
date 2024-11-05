import { dehydrate, useQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { fetchPartners } from "@/fetchers/public.fecher";
import PAGE from "@/routes";
import { queryClient } from "@/lib/queryCache";
import { seoConfig } from "@/lib/seoConfig";
import { verifyID } from "@/lib/authHelpers";
import ErrorModal from "@/components/SignupFlow/ErrorModal";
import { TENANT } from "@/lib/tenantHelper";
import { LoginErrorsEnum } from "@/constants/enum/login.enum";

const LoginBased = dynamic(() => import("@/components/Login/loginGlobal"), {
    ssr: true,
});
const LoginCitCap = dynamic(() => import("@/components/Login/loginCitCap"), {
    ssr: true,
});
const LoginCyberKongz = dynamic(() => import("@/components/Login/loginCyberKongz"), { ssr: true });
const LoginApes = dynamic(() => import("@/components/Login/loginApes"), { ssr: true });

const TENANTS_LOGIN = (data) => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return <LoginBased ssrData={data} />;
        }
        case TENANT.NeoTokyo: {
            return <LoginCitCap />;
        }
        case TENANT.CyberKongz: {
            return <LoginCyberKongz />;
        }
        case TENANT.BAYC: {
            return <LoginApes />;
        }
    }
};

export default function Login({ isAuthenticated }) {
    let [errorModal, setErrorModal] = useState(null);
    const router = useRouter();
    const seo = seoConfig(PAGE.Login);

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/app");
        }
    }, []);

    useEffect(() => {
        if (router?.query?.error === LoginErrorsEnum.CREDENTIALS_ERROR) {
            setErrorModal(LoginErrorsEnum.CREDENTIALS_ERROR);
        }
        if (router?.query?.error === LoginErrorsEnum.GEOLOCATION_ERROR) {
            setErrorModal(LoginErrorsEnum.GEOLOCATION_ERROR);
        }
    }, [router.query]);

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
            {TENANTS_LOGIN(data)}
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
