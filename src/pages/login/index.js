import { dehydrate, useQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { fetchPartners } from "@/fetchers/public.fecher";
import { PAGE } from "@/lib/enum/route";
import { queryClient } from "@/lib/queryCache";
import { verifyID } from "@/lib/authHelpers";
import ErrorProvider from "@/components/SignupFlow/ErrorProvider";
import { getTenantConfig, TENANT } from "@/lib/tenantHelper";

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

const {
    DESCRIPTION,
    INFO: { og, twitter },
    PAGES: {
        [PAGE.Login]: { title, url },
    },
} = getTenantConfig().seo;

export default function Login({ isAuthenticated }) {
    const router = useRouter();

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
        <ErrorProvider>
            <NextSeo title={title} description={DESCRIPTION} canonical={url} openGraph={og} twitter={twitter} />
            {TENANTS_LOGIN(data)}
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
