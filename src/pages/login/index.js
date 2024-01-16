import {dehydrate, useQuery} from "@tanstack/react-query";
import {fetchPartners} from "@/fetchers/public.fecher";
import PAGE from "@/routes";
import {queryClient} from '@/lib/queryCache'
import {NextSeo} from "next-seo";
import {seoConfig} from "@/lib/seoConfig";
import {verifyID} from "@/lib/authHelpers";
import LoginCitCap from "@/components/Login/loginCitCap";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {isBased} from "@/lib/utils";
import LoginGlobal from "@/components/Login/loginGlobal";
import ErrorModal from "@/components/SignupFlow/ErrorModal";

export default function Login({isAuthenticated}) {
    let [errorModal, setErrorModal] = useState(false)
    const router = useRouter();
    const seo = seoConfig(PAGE.Login)


    useEffect(() => {
        if (isAuthenticated) {
            console.log("client redirect")
            router.replace('/app');
        }
    }, []);

    useEffect(() => {
        if (router?.query?.error === "CredentialsSignin") {
            setErrorModal(true)
        }
    }, [router.query])

    const { data} = useQuery({
            queryKey: ["partnerList"],
            queryFn: fetchPartners,
            cacheTime: 180 * 60 * 1000,
            staleTime: 90 * 60 * 1000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    );



    return (
        <>
            <NextSeo
                title={seo.title}
                description={seo.description}
                canonical={seo.url}
                openGraph={seo.og}
                twitter={seo.twitter}
            />
            {isBased ? <LoginGlobal ssrData={data}/> : <LoginCitCap/>}
            <ErrorModal model={errorModal} setter={() => {
                setErrorModal(false)
            }}/>
        </>
    )
}

export const getServerSideProps = async ({req, res}) => {
    const account = await verifyID(req)

    await queryClient.prefetchQuery({
        queryKey: ["partnerList"],
        queryFn: fetchPartners,
        cacheTime: 180 * 60 * 1000,
        staleTime: 90 * 60 * 1000
    })

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            isAuthenticated: account.auth
        }
    }
}


