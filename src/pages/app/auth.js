import LayoutApp from '@/components/Layout/LayoutApp';
import Loader from "@/components/App/Loader";
import Head from "next/head";
import routes from "@/routes";
import {useEffect} from "react";
import {refresh} from "@/fetchers/auth.fetcher";
import {useRouter} from "next/router";
import {authTokenName} from "@/lib/authHelpers";
export default function AuthRefresh() {
    const router = useRouter();
    const callbackUrl = router.query.callbackUrl;

    useEffect(() => {
        const authenticate = async () => {
            const success = await refresh()
            if(success && callbackUrl) router.push(callbackUrl)
            else router.push(routes.Landing)
        }
        authenticate()
    }, [])


    return <>
        <Head>
            <title>Loading - 3VC</title>
        </Head>
        <div className={"flex flex-col h-full"}>
            <Loader/>
        </div>
    </>
}


export const getServerSideProps = async({res}) => {
    const token = res.req.cookies[authTokenName]
    const callback = res.req.query.callbackUrl
    if(!token){
        return {
            redirect: {
                permanent: true,
                destination: callback ? `${routes.Login}?callbackUrl=${callback}` : routes.Login
            }
        }
    }
    return {
        props: {}
    }
}

AuthRefresh.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};


