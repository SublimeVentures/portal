import {dehydrate} from "@tanstack/react-query";
import {fetchPartners} from "@/fetchers/public.fecher";
import PAGE from "@/routes";
import { queryClient } from '@/lib/queryCache'
import {NextSeo} from "next-seo";
import { seoConfig} from "@/lib/seoConfig";
import {verifyID} from "@/lib/authHelpers";
import LoginCitCap from "@/components/Login/loginCitCap";
import LoginBased from "@/components/Login/loginBased";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import dynamic from "next/dynamic";
import {is3VC} from "@/lib/utils";
const ErrorModal = dynamic(() => import('@/components/SignupFlow/ErrorModal'), {ssr: false})

export default function Login({}) {
    let [errorModal, setErrorModal] = useState(false)
    const router = useRouter();
    const seo = seoConfig(PAGE.Login)

    useEffect(()=> {
        if(router?.query?.error === "CredentialsSignin") {
            setErrorModal(true)
        }
    }, [router.query])

    return (
        <>
            <NextSeo
                title={seo.title}
                description={seo.description}
                canonical={seo.url}
                openGraph={seo.og}
                twitter={seo.twitter}
            />
            {is3VC ? <LoginBased/> : <LoginCitCap/> }
            <ErrorModal model={errorModal} setter={() => {setErrorModal(false)}}/>
        </>
    )
}

export const getServerSideProps = async({res}) => {
    const account = await verifyID(res.req)
    if(account.auth){
        return {
            redirect: {
                permanent: false,
                destination: "/app"
            }
        }
    }

    await queryClient.prefetchQuery({
        queryKey: ["partnerList"],
        queryFn: fetchPartners,
        cacheTime: 180 * 60 * 1000,
        staleTime: 90 * 60 * 1000
    })

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        }
    }
}
